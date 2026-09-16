import { prisma } from '../lib/prisma';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const companySlug = 'amazon';
  const roleName = 'Front End Engineer Intern';

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
      title: 'Accordion UI Component'
    }
  });

  if (!existingUiQ) {
    await prisma.uIBuildQuestion.create({
      data: {
        title: 'Accordion UI Component',
        description: 'Create an Accordion component. Clicking headers opens/closes the section. A checkbox switches between single-open and multi-open mode.',
        requirements: JSON.stringify([
          "Multiple accordion sections with headers and content panels",
          "Clicking a header toggles the visibility of its corresponding content panel",
          "A checkbox labeled 'Single Open Mode'",
          "When 'Single Open Mode' is checked, opening a section should close all other open sections",
          "When 'Single Open Mode' is unchecked, multiple sections can be open at the same time"
        ]),
        defaultHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UI Build Challenge - Accordion</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h2>Accordion Component</h2>
    
    <div class="controls">
      <label>
        <input type="checkbox" id="single-open-checkbox"> Single Open Mode
      </label>
    </div>

    <div class="accordion" id="accordion-container">
      <!-- Build your accordion items here -->
      <div class="accordion-item">
        <button class="accordion-header">Section 1</button>
        <div class="accordion-content">Content for section 1.</div>
      </div>
      <div class="accordion-item">
        <button class="accordion-header">Section 2</button>
        <div class="accordion-content">Content for section 2.</div>
      </div>
      <div class="accordion-item">
        <button class="accordion-header">Section 3</button>
        <div class="accordion-content">Content for section 3.</div>
      </div>
    </div>
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
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.controls {
  margin-bottom: 20px;
}

.accordion-item {
  border: 1px solid #ddd;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  text-align: left;
  padding: 16px;
  background-color: #f1f1f1;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.accordion-header:hover {
  background-color: #e2e2e2;
}

.accordion-content {
  padding: 16px;
  background-color: white;
  display: none;
}

/* Add any additional styles you need */
`,
        defaultJs: `// Add your JavaScript logic here

document.addEventListener('DOMContentLoaded', () => {
  console.log("Accordion initialized");
});
`,
        companyId: company.id,
        roleId: role.id,
        oaSetNo: 2,
      }
    });
    console.log("Successfully seeded UI Build question Set 2!");
  } else {
    console.log("UI Build question Set 2 already exists.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
