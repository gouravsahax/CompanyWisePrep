import { prisma } from '../lib/prisma';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const companySlug = 'amazon';
  const roleName = 'Front End Engineer Intern';
  const oaSetNo = 1; // Corresponding to mockOAs.ts ID 'cmu...-oa-ui' where oaSetNo would conceptually be 1 for UI set 1

  const company = await prisma.company.findUnique({
    where: { slug: companySlug }
  });

  if (!company) {
    console.error(`Company ${companySlug} not found`);
    return;
  }

  const role = await prisma.role.findFirst({
    where: {
      name: roleName,
      companyId: company.id
    }
  });

  if (!role) {
    console.error(`Role ${roleName} not found`);
    return;
  }

  const existingUiQ = await prisma.uIBuildQuestion.findFirst({
    where: {
      companyId: company.id,
      roleId: role.id,
      title: 'Form and Table UI'
    }
  });

  if (!existingUiQ) {
    await prisma.uIBuildQuestion.create({
      data: {
        title: 'Form and Table UI',
        description: 'Create a Vanilla JS web page with a form to collect Name, Email, and Phone. Below the form, display a table of the submitted valid entries. Implement a simple filter for the table.',
        requirements: JSON.stringify([
          "Form with Name, Email, and Phone fields",
          "Client-side validation for all fields (non-empty, basic email format, 10 digit phone format)",
          "A table that dynamically displays submitted valid entries",
          "A text input that filters the table rows by Name or Email in real-time"
        ]),
        defaultHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UI Build Challenge</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h2>User Registration</h2>
    <!-- Build your form here -->
    
    <h2>Registered Users</h2>
    <!-- Build your filter and table here -->
    
  </div>
  <script src="script.js"></script>
</body>
</html>`,
        defaultCss: `body {
  font-family: system-ui, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Add your styles here */
`,
        defaultJs: `// Add your JavaScript logic here

document.addEventListener('DOMContentLoaded', () => {
  console.log("App initialized");
});
`,
        companyId: company.id,
        roleId: role.id,
        oaSetNo: 1,
      }
    });
    console.log("Successfully seeded UI Build question!");
  } else {
    console.log("UI Build question already exists.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
