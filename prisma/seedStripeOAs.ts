import { prisma } from '../lib/prisma';

async function main() {
  const stripeCompany = await prisma.company.findUnique({ where: { slug: "stripe" } });
  if (!stripeCompany) throw new Error("Stripe not found in DB");

  const stripeRole = await prisma.role.findFirst({
    where: { companyId: stripeCompany.id, name: "Software Engineer Intern" }
  });
  if (!stripeRole) throw new Error("Stripe Software Engineer Intern role not found");

  await prisma.dSAQuestion.deleteMany({ where: { companyId: stripeCompany.id } });

  // Question 1
  const q1 = {
    title: "Merchant Fraud Risk Monitor",
    description: `Implement an event-driven risk evaluation engine that tracks live authorizations and customer dispute events to flag fraudulent merchants based on Merchant Category Code (MCC) risk thresholds.

Merchants operate under specific industry codes designated by an MCC (such as "retail", "electronics", or "airline"). Each MCC carries a floating-point fraud ratio threshold $T$, where $0.0 \\le T \\le 1.0$. A merchant account is classified as fraudulent at the end of stream evaluation if and only if both of the following invariants hold:

1. The merchant has accumulated a total lifetime transaction volume of at least \`minTransactions\` charges (total $\\ge$ minTransactions, with total > 0).
2. The merchant's net fraud ratio, defined as $\\frac{\\text{fraudulent\\_charges}}{\\text{total\\_charges}}$, is strictly greater than or equal to their MCC fraud threshold (ratio $\\ge T$).

The input stream presents a chronological array of comma-separated string commands:
* \`CHARGE,charge_id,account_id,amount,code\`: Denotes a payment attempt. The engine must increment the merchant's total charge count by 1. If the transaction code exists in the provided \`fraudCodes\` set, the transaction is classified as fraudulent, incrementing the merchant's fraud charge count by 1.
* \`DISPUTE,charge_id\`: Denotes a dispute resolution that overturns the fraudulent classification of a prior transaction. If the referenced \`charge_id\` was previously recorded as fraudulent, the merchant's fraud count is decremented by 1. A dispute reverses the fraud classification but does not decrement the merchant's total charge volume.

The risk engine must enforce strict operational constraints:
* **Dispute Idempotency**: Subsequent DISPUTE commands referencing an already-disputed \`charge_id\` must be treated as no-ops.
* **Non-Fraud Dispute Isolation**: If a dispute references a transaction whose original authorization code was not fraudulent, the dispute is recorded as handled, but the merchant's fraud counter remains unchanged.
* **Unknown Entity Safety**: A dispute referencing an unrecognized \`charge_id\`, or a charge referencing an unregistered \`account_id\`, must be discarded without throwing runtime exceptions.
* **Deterministic Sort**: The function returns an array of flagged \`account_id\` strings sorted in ascending ASCII lexicographical order.`,
    constraints: `* Length of \`fraudCodes\`: $1 \\le |\\text{fraudCodes}| \\le 100$.
* Length of \`mccThresholds\`: $1 \\le |\\text{mccThresholds}| \\le 500$.
* Length of \`merchantMcc\`: $1 \\le |\\text{merchantMcc}| \\le 10{,}000$.
* Evaluation volume gate: $0 \\le \\text{minTransactions} \\le 100{,}000$.
* Length of \`events\`: $1 \\le |\\text{events}| \\le 200{,}000$.
* All identifiers (\`charge_id\`, \`account_id\`, \`mcc\`, \`code\`) are alphanumeric strings with lengths between 1 and 32 characters.
* Amounts are positive integers up to $10^9$.
* Float comparisons must handle numerical precision tolerances within $10^{-9}$.`,
    topic: "Stream Processing, State Machine, Hash Maps",
    dataStructure: "Hash Maps, Sets",
    timeComplexity: "O(M + E + F + K log K)",
    spaceComplexity: "O(M + E + F)",
    timeBudget: "2.0s",
    correctSolution: {
      "python": `class Solution:
    def detectFraudulentMerchants(self, fraudCodes, mccThresholds, merchantMcc, minTransactions, events):
        fraud_code_set = set(fraudCodes)
        category_thresholds = {}
        for entry in mccThresholds:
            mcc, val = entry.split(",", 1)
            category_thresholds[mcc] = float(val)
        
        merchant_categories = {}
        merchant_metrics = {}
        for entry in merchantMcc:
            acc_id, mcc = entry.split(",", 1)
            merchant_categories[acc_id] = mcc
            merchant_metrics[acc_id] = [0, 0]
        
        transaction_ledger = {}
        
        for raw_event in events:
            tokens = raw_event.split(",")
            command = tokens[0]
            
            if command == "CHARGE":
                _, charge_id, account_id, amount_str, code = tokens
                if account_id not in merchant_metrics:
                    continue
                fraud_flag = code in fraud_code_set
                transaction_ledger[charge_id] = [account_id, fraud_flag, False]
                metrics = merchant_metrics[account_id]
                metrics[0] += 1
                if fraud_flag:
                    metrics[1] += 1
            elif command == "DISPUTE":
                _, charge_id = tokens
                metadata = transaction_ledger.get(charge_id)
                if metadata is not None and not metadata[2]:
                    metadata[2] = True
                    if metadata[1]:
                        acc_id = metadata[0]
                        merchant_metrics[acc_id][1] -= 1
        
        flagged_accounts = []
        for account_id, (total_vol, fraud_vol) in merchant_metrics.items():
            if total_vol >= minTransactions and total_vol > 0:
                mcc = merchant_categories[account_id]
                threshold = category_thresholds.get(mcc, 1.0)
                fraud_ratio = fraud_vol / total_vol
                if fraud_ratio >= threshold - 1e-9:
                    flagged_accounts.append(account_id)
        
        flagged_accounts.sort()
        return flagged_accounts`
    },
    examples: [
      {
        input: `fraudCodes = ["stolen_card", "lost_card"]\nmccThresholds = ["retail,0.5", "restaurant,0.3"]\nmerchantMcc = ["acct_A,retail", "acct_B,restaurant"]\nminTransactions = 2\nevents = [\n  "CHARGE,c1,acct_A,100,approved",\n  "CHARGE,c2,acct_A,200,stolen_card",\n  "CHARGE,c3,acct_B,50,lost_card"\n]`,
        output: `["acct_A"]`,
        explanation: `For acct_A, two charges are processed (c1 approved, c2 stolen). Total volume equals 2, fraud volume equals 1, yielding a net ratio of 1 / 2 = 0.5. Because 2 >= 2 and 0.5 >= 0.5, acct_A is flagged. For acct_B, one charge is recorded (c3 lost). While its ratio is 1.0 >= 0.3, its total volume of 1 is less than minTransactions (2). acct_B is excluded.`
      }
    ],
    runTestCases: [
      {
        execArgs: [["stolen_card", "lost_card"], ["retail,0.5", "restaurant,0.3"], ["acct_A,retail", "acct_B,restaurant"], 2, ["CHARGE,c1,acct_A,100,approved", "CHARGE,c2,acct_A,200,stolen_card", "CHARGE,c3,acct_B,50,lost_card"]],
        execOutput: ["acct_A"]
      },
      {
        execArgs: [["fraud_test", "stolen_card"], ["tech,0.4"], ["acct_Z,tech"], 2, ["CHARGE,c1,acct_Z,1000,fraud_test", "CHARGE,c2,acct_Z,2000,approved", "DISPUTE,c1"]],
        execOutput: []
      }
    ],
    submitTestCases: [
      {
        execArgs: [["do_not_honor", "stolen_card", "lost_card"], ["retail,0.5", "airline,0.25"], ["acc_1,retail", "acc_2,airline"], 2, ["CHARGE,ch_1,acc_1,100,approved", "CHARGE,ch_2,acc_1,200,stolen_card", "CHARGE,ch_3,acc_1,150,do_not_honor", "CHARGE,ch_4,acc_2,500,stolen_card", "CHARGE,ch_5,acc_2,300,approved", "DISPUTE,ch_2"]],
        execOutput: ["acc_2"]
      },
      {
        execArgs: [["card_declined", "suspected_fraud"], ["digital,0.333333"], ["merchant_x,digital"], 3, ["CHARGE,c1,merchant_x,50,approved", "CHARGE,c2,merchant_x,50,suspected_fraud", "CHARGE,c3,merchant_x,50,approved"]],
        execOutput: ["merchant_x"]
      }
    ],
    templates: {
      "cpp": `#include <bits/stdc++.h>\n\nclass Solution {\npublic:\n    std::vector<std::string> detectFraudulentMerchants(\n        const std::vector<std::string>& fraudCodes,\n        const std::vector<std::string>& mccThresholds,\n        const std::vector<std::string>& merchantMcc,\n        int minTransactions,\n        const std::vector<std::string>& events\n    ) {\n        std::vector<std::string> result;\n        // Implementation logic\n        return result;\n    }\n};`,
      "java": `import java.util.*;\n\npublic class Solution {\n    public List<String> detectFraudulentMerchants(\n        List<String> fraudCodes,\n        List<String> mccThresholds,\n        List<String> merchantMcc,\n        int minTransactions,\n        List<String> events\n    ) {\n        List<String> result = new ArrayList<>();\n        // Implementation logic\n        return result;\n    }\n}`,
      "python": `class Solution:\n    def detectFraudulentMerchants(\n        self,\n        fraudCodes: list[str],\n        mccThresholds: list[str],\n        merchantMcc: list[str],\n        minTransactions: int,\n        events: list[str],\n    ) -> list[str]:\n        # Implementation logic\n        return []`
    },
    companyId: stripeCompany.id,
    roleId: stripeRole.id,
    oaSetNo: 1
  };

  await prisma.dSAQuestion.create({ data: q1 });
  console.log("Seeded Stripe Q1");

  // Question 2
  const q2 = {
    title: "Stateful WebSocket Load Balancer",
    description: `Simulate an application-level load balancer that routes persistent WebSocket connection requests across an active cluster of backend targets.

The cluster hosts \`numTargets\` server instances referenced by 1-based indexing ($1 \\le \\text{targetIndex} \\le \\text{numTargets}$). Each target enforces an identical maximum concurrency limit of \`maxConnectionsPerTarget\`.

The load balancer receives an ordered sequence of comma-separated string commands:
1. \`CONNECT,connectionId,userId,objectId\` (or \`CONNECT,connectionId,userId\` when \`objectId\` is omitted):
   * Establishes a new WebSocket connection.
   * **Sticky Object Affinity**: If \`objectId\` is provided and an active connection sharing that \`objectId\` is already assigned to a target $T$, the new connection must route to target $T$. If target $T$ is at maximum capacity or marked offline, the connection is **rejected**.
   * **Least-Loaded Selection**: If \`objectId\` is omitted or does not hold an active target binding, the connection routes to an online target with the minimum active connection count.
   * **Tie-Breaking Determinism**: If multiple eligible targets have the same active load, the target with the **smallest 1-based index** is selected.
   * **Exhaustion Rejection**: If all eligible targets are operating at capacity, the connection is rejected.
   * **Audit Log Emission**: Successful assignments append a log entry formatted as \`"connectionId,userId,targetIndex"\`. Rejected connections produce **no log output**.
2. \`DISCONNECT,connectionId\`:
   * Closes an active connection and decrements the host target's active load.
   * If this was the last active connection referencing its \`objectId\`, the affinity binding for that \`objectId\` is deleted.
   * A disconnect targeting an unknown \`connectionId\` is safely ignored.
   * DISCONNECT produces no log output.
3. \`SHUTDOWN,targetIndex\`:
   * Marks target \`targetIndex\` offline for maintenance.
   * All active connections on \`targetIndex\` are evicted.
   * The balancer attempts to reallocate evicted connections to the remaining online targets in **ascending order of connectionId**. Reallocations apply standard CONNECT logic.
   * Each successfully reallocated connection emits a log entry: \`"connectionId,userId,newTargetIndex"\`.
   * Evicted connections that cannot be accommodated due to cluster exhaustion are permanently dropped.
   * Once all evictees are processed, target \`targetIndex\` returns online with zero active load.`,
    constraints: `* \`numTargets\`: $1 \\le \\text{numTargets} \\le 1{,}000$.
* \`maxConnectionsPerTarget\`: $1 \\le \\text{capacity} \\le 1{,}000$.
* Length of \`requests\`: $1 \\le |\\text{requests}| \\le 100{,}000$.
* All identifiers (\`connectionId\`, \`userId\`, \`objectId\`) contain between 1 and 32 alphanumeric characters and underscores.
* Target indices in SHUTDOWN operations satisfy $1 \\le \\text{targetIndex} \\le \\text{numTargets}$.`,
    topic: "System Design, Load Balancing, Priority Queues",
    dataStructure: "Hash Maps, Sets",
    timeComplexity: "O(R * N) or O(R log N)",
    spaceComplexity: "O(N + C + B)",
    timeBudget: "2.0s",
    correctSolution: {
      "python": `class Solution:
    def routeRequests(self, num_targets, max_connections_per_target, requests):
        target_loads = [0] * (num_targets + 1)
        offline_targets = set()
        session_registry = {}
        object_affinity_map = {}
        object_ref_counter = {}
        audit_trail = []

        def find_least_loaded():
            selected_target = -1
            min_load = max_connections_per_target
            for t in range(1, num_targets + 1):
                if t in offline_targets:
                    continue
                if target_loads[t] < min_load:
                    min_load = target_loads[t]
                    selected_target = t
            return selected_target

        def terminate(conn_id):
            if conn_id not in session_registry:
                return
            host_target, _, obj_id = session_registry.pop(conn_id)
            target_loads[host_target] -= 1
            if obj_id:
                object_ref_counter[obj_id] -= 1
                if object_ref_counter[obj_id] == 0:
                    del object_ref_counter[obj_id]
                    del object_affinity_map[obj_id]

        def dispatch(conn_id, user_id, obj_id):
            if obj_id and obj_id in object_affinity_map:
                bound_target = object_affinity_map[obj_id]
                if bound_target not in offline_targets and target_loads[bound_target] < max_connections_per_target:
                    target = bound_target
                else:
                    return None
            else:
                target = find_least_loaded()
                if target == -1:
                    return None
                if obj_id:
                    object_affinity_map[obj_id] = target

            target_loads[target] += 1
            session_registry[conn_id] = (target, user_id, obj_id)
            if obj_id:
                object_ref_counter[obj_id] = object_ref_counter.get(obj_id, 0) + 1
            return f"{conn_id},{user_id},{target}"

        for raw_cmd in requests:
            tokens = raw_cmd.split(",")
            action = tokens[0]
            if action == "CONNECT":
                conn_id = tokens[1]
                user_id = tokens[2]
                obj_id = tokens[3] if len(tokens) > 3 else ""
                log_entry = dispatch(conn_id, user_id, obj_id)
                if log_entry is not None:
                    audit_trail.append(log_entry)
            elif action == "DISCONNECT":
                terminate(tokens[1])
            elif action == "SHUTDOWN":
                shut_target = int(tokens[1])
                offline_targets.add(shut_target)
                evicted_sessions = [
                    (cid, uid, oid)
                    for cid, (t, uid, oid) in session_registry.items()
                    if t == shut_target
                ]
                for cid, _, _ in evicted_sessions:
                    terminate(cid)
                evicted_sessions.sort(key=lambda x: x[0])
                for cid, uid, oid in evicted_sessions:
                    log_entry = dispatch(cid, uid, oid)
                    if log_entry is not None:
                        audit_trail.append(log_entry)
                offline_targets.remove(shut_target)
        
        return audit_trail`
    },
    examples: [
      {
        input: `numTargets = 3\nmaxConnectionsPerTarget = 5\nrequests = [\n  "CONNECT,c1,userA,doc1",\n  "CONNECT,c2,userB,doc2",\n  "CONNECT,c3,userC,doc1",\n  "DISCONNECT,c1",\n  "CONNECT,c4,userD,doc1"\n]`,
        output: `["c1,userA,1", "c2,userB,2", "c3,userC,1", "c4,userD,1"]`,
        explanation: `At start, all targets have load 0. Connection c1 binds doc1 to target 1 (load 1). Connection c2 binds doc2 to target 2 (load 1). Connection c3 carries doc1, matching the sticky binding on target 1 (target 1 load becomes 2). Next, DISCONNECT,c1 frees one connection on target 1 (load drops to 1); because c3 remains active, doc1 remains bound to target 1. Connection c4 arrives with doc1 and routes to target 1.`
      }
    ],
    runTestCases: [
      {
        execArgs: [3, 5, ["CONNECT,c1,userA,doc1", "CONNECT,c2,userB,doc2", "CONNECT,c3,userC,doc1", "DISCONNECT,c1", "CONNECT,c4,userD,doc1"]],
        execOutput: ["c1,userA,1", "c2,userB,2", "c3,userC,1", "c4,userD,1"]
      }
    ],
    submitTestCases: [
      {
        execArgs: [2, 1, ["CONNECT,c1,u1,doc1", "CONNECT,c2,u2,doc2", "CONNECT,c3,u3,doc3", "CONNECT,c4,u4,doc1"]],
        execOutput: ["c1,u1,1", "c2,u2,2"]
      }
    ],
    templates: {
      "cpp": `#include <bits/stdc++.h>\n\nclass Solution {\npublic:\n    std::vector<std::string> routeRequests(\n        int numTargets,\n        int maxConnectionsPerTarget,\n        const std::vector<std::string>& requests\n    ) {\n        std::vector<std::string> results;\n        // Implementation logic\n        return results;\n    }\n};`,
      "java": `import java.util.*;\n\npublic class Solution {\n    public List<String> routeRequests(\n        int numTargets,\n        int maxConnectionsPerTarget,\n        List<String> requests\n    ) {\n        List<String> results = new ArrayList<>();\n        // Implementation logic\n        return results;\n    }\n}`,
      "python": `class Solution:\n    def routeRequests(\n        self,\n        numTargets: int,\n        maxConnectionsPerTarget: int,\n        requests: list[str],\n    ) -> list[str]:\n        # Implementation logic\n        return []`
    },
    companyId: stripeCompany.id,
    roleId: stripeRole.id,
    oaSetNo: 2
  };

  await prisma.dSAQuestion.create({ data: q2 });
  console.log("Seeded Stripe Q2");

  // Question 3
  const q3 = {
    title: "Store Closing Time Multi-Day Log Aggregator",
    description: `A merchant tracks hourly foot traffic to establish an optimal store closing hour. Each operational hour is recorded as 'Y' (customers present) or 'N' (no customers present).

For a day log of duration $n$ hours, closing after hour $c$, where $0 \\le c \\le n$, yields two operational penalties:
* **Idle Labor Overhead**: +1 penalty for every open hour ($h < c$) where no customers arrived ('N').
* **Lost Commerce Overhead**: +1 penalty for every closed hour ($h \\ge c$) where customers were turned away ('Y').

The optimal closing time $c^*$ minimizes the total penalty. If multiple closing times produce the identical minimal penalty, the tie is broken by choosing the **smallest closing hour**.

Unformatted telemetry streams deliver multiple days of data in a single raw string containing arbitrary spaces, tab characters, line breaks, and extraneous text. The engine tokenizes the string and extracts valid daily logs according to the following grammar:
* A valid daily log starts strictly with token "BEGIN", contains zero or more customer presence tokens ('Y' or 'N'), and terminates with token "END".
* **No Nesting**: Daily logs cannot be nested. If a subsequent "BEGIN" token appears before the active block is closed by "END", the prior incomplete sequence is dropped, and a new log begins.
* **Foreign Token Corruption**: The presence of any token other than 'Y', 'N', "BEGIN", or "END" inside a log block corrupts that block, requiring it to be discarded.
* **Preserved Evaluation Order**: The function returns an array of optimal closing hours matching the chronological order of valid logs extracted from the stream.`,
    constraints: `* String length: $1 \\le |\\text{aggregateLog}| \\le 500{,}000$ characters.
* Log length per day: $0 \\le n \\le 100{,}000$.
* Count of valid extracted daily logs: $\\le 10{,}000$.
* The implementation must execute in $O(L)$ total time, where $L$ is the character length of \`aggregateLog\`.`,
    topic: "String Parsing, Arrays, Prefix Sums",
    dataStructure: "Strings, Arrays",
    timeComplexity: "O(L)",
    spaceComplexity: "O(n)",
    timeBudget: "2.0s",
    correctSolution: {
      "python": `class Solution:
    def calculate_optimal_closing_hour(self, daily_log: list[str]) -> int:
        duration = len(daily_log)
        running_penalty = sum(1 for token in daily_log if token == "Y")
        lowest_penalty = running_penalty
        optimal_hour = 0
        
        for i in range(duration):
            if daily_log[i] == "Y":
                running_penalty -= 1
            else:
                running_penalty += 1
            
            if running_penalty < lowest_penalty:
                lowest_penalty = running_penalty
                optimal_hour = i + 1
                
        return optimal_hour

    def getBestClosingTimes(self, aggregateLog: str) -> list[int]:
        schedule_results = []
        tokens = aggregateLog.split()
        inside_block = False
        block_corrupted = False
        token_buffer = []
        
        for token in tokens:
            if token == "BEGIN":
                inside_block = True
                block_corrupted = False
                token_buffer = []
            elif token == "END":
                if inside_block and not block_corrupted:
                    schedule_results.append(self.calculate_optimal_closing_hour(token_buffer))
                inside_block = False
                block_corrupted = False
                token_buffer = []
            else:
                if inside_block and not block_corrupted:
                    if token in ("Y", "N"):
                        token_buffer.append(token)
                    else:
                        block_corrupted = True
                        
        return schedule_results`
    },
    examples: [
      {
        input: `aggregateLog = "BEGIN Y Y N Y END"`,
        output: `[2]`,
        explanation: `The log contains four hourly tokens: ['Y', 'Y', 'N', 'Y'] (n = 4).
- c = 0: penalty 3.
- c = 1: penalty 2.
- c = 2: penalty 1.
- c = 3: penalty 2.
- c = 4: penalty 1.
Minimum penalty is 1, occurring at c = 2 and c = 4. The tie-breaking rule selects the earlier hour (2).`
      }
    ],
    runTestCases: [
      {
        execArgs: ["BEGIN Y Y N Y END"],
        execOutput: [2]
      },
      {
        execArgs: ["PREFIX BEGIN Y N END NOISE BEGIN Y Y BEGIN N N END SUFFIX"],
        execOutput: [1, 0]
      }
    ],
    submitTestCases: [
      {
        execArgs: ["BEGIN Y N Y END BEGIN Y Y Y END"],
        execOutput: [1, 3]
      },
      {
        execArgs: ["garbage BEGIN END more_garbage BEGIN N N N END"],
        execOutput: [0, 0]
      }
    ],
    templates: {
      "cpp": `#include <bits/stdc++.h>\n\nclass Solution {\npublic:\n    std::vector<int> getBestClosingTimes(const std::string& aggregateLog) {\n        std::vector<int> results;\n        // Implementation logic\n        return results;\n    }\n};`,
      "java": `import java.util.*;\n\npublic class Solution {\n    public List<Integer> getBestClosingTimes(String aggregateLog) {\n        List<Integer> results = new ArrayList<>();\n        // Implementation logic\n        return results;\n    }\n}`,
      "python": `class Solution:\n    def getBestClosingTimes(self, aggregateLog: str) -> list[int]:\n        # Implementation logic\n        return []`
    },
    companyId: stripeCompany.id,
    roleId: stripeRole.id,
    oaSetNo: 3
  };

  await prisma.dSAQuestion.create({ data: q3 });
  console.log("Seeded Stripe Q3");
}

main().catch(console.error).finally(() => prisma.$disconnect());
