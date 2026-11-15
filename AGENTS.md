

\# AGENTS.md



\# Slow Island — Project Development Guide



\## 1. Project Overview



Project Name: Slow Island（慢慢小島）



Slow Island is a cozy and relaxing interactive website where users can complete small daily tasks, collect rewards, and gradually decorate their own island.



Users can:

\- Complete daily tasks.

\- Earn stars and shells.

\- Unlock plants, furniture, and decorations.

\- Decorate their own island.

\- View their collections and achievements.



The purpose of this project is to create a reusable website structure that AI can continue developing by following this document.



\## 2. Core Development Principles



1\. Keep the website simple, friendly, and easy to use.

2\. All new features must follow the existing project structure.

3\. Reuse existing components and styles whenever possible.

4\. Do not remove existing features when adding new ones.

5\. Keep the project compatible with GitHub Pages.

6\. Do not require a backend or user account.

7\. Save user progress using localStorage.



\## 3. Visual Design Guidelines



\### Overall Style

\- Cozy, cute, warm, and relaxing.

\- Hand-drawn illustration style.

\- Slight paper texture.

\- Soft and natural colors.

\- Friendly and playful interface.

\- Avoid overly futuristic or corporate designs.



\### Color Palette

\- Cream background: #F5F0E6

\- Soft green: #829968

\- Olive green: #657B4D

\- Light beige: #E8DDC8

\- Warm brown: #8C7157

\- Soft blue: #B9CFCC



Use these colors consistently throughout the website.



\### UI Components

\- Use rounded cards and buttons.

\- Keep spacing comfortable.

\- Use soft shadows.

\- Use illustrations as decorative elements.

\- Keep typography readable.

\- Avoid excessive gradients and strong contrast.

\- Maintain a consistent visual style across all pages.



\## 4. Website Structure



Main pages:



\- index.html: Homepage and island overview.

\- pages/tasks.html: Daily task management.

\- pages/island.html: Island decoration.

\- pages/collection.html: Item collection gallery.

\- pages/progress.html: Achievements and statistics.



Every page should include:

1\. Consistent navigation.

2\. A clear page title.

3\. Main content area.

4\. Consistent visual components.

5\. Responsive layout.



\## 5. File Structure



Follow this project structure:



slow-island/

├── AGENTS.md

├── README.md

├── index.html

├── pages/

│   ├── tasks.html

│   ├── island.html

│   ├── collection.html

│   └── progress.html

├── assets/

│   ├── css/

│   │   └── style.css

│   ├── js/

│   │   ├── main.js

│   │   ├── storage.js

│   │   ├── tasks.js

│   │   └── island.js

│   └── images/

│       ├── island/

│       ├── items/

│       └── characters/

└── data/

&#x20;   ├── tasks.js

&#x20;   ├── items.js

&#x20;   └── achievements.js



Do not create unnecessary files or duplicate existing functionality.



\## 6. File Naming Rules



\- Use lowercase English letters.

\- Use hyphens for multi-word names.

\- Do not use spaces in file names.

\- Use clear names that describe the file purpose.

\- Keep existing file names unless there is a clear reason to change them.



Examples:

\- daily-tasks.js

\- small-tree.png

\- island-background.png



\## 7. Data Structure Rules



\### Task Data



Every task must contain:



\- id

\- title

\- description

\- category

\- reward



Example:



&#x20;   {

&#x20;     id: "drink-water",

&#x20;     title: "喝一杯水",

&#x20;     description: "給自己一點時間補充水分",

&#x20;     category: "daily-life",

&#x20;     reward: {

&#x20;       type: "star",

&#x20;       amount: 5

&#x20;     }

&#x20;   }



\### Item Data



Every item must contain:



\- id

\- name

\- category

\- description

\- cost

\- image



Example:



&#x20;   {

&#x20;     id: "small-tree",

&#x20;     name: "小樹",

&#x20;     category: "plant",

&#x20;     description: "讓小島多一點綠意",

&#x20;     cost: {

&#x20;       type: "star",

&#x20;       amount: 20

&#x20;     },

&#x20;     image: "assets/images/items/small-tree.png"

&#x20;   }



Keep item definitions separate from the user's unlocked and placed item states.



\## 8. Reward System



The reward system uses two currencies:



\- Stars: Earned by completing daily tasks.

\- Shells: Used for special rewards and future features.



Rules:

1\. Users receive rewards only after completing a task.

2\. The same task cannot reward users repeatedly on the same day.

3\. Users cannot purchase items without enough currency.

4\. Purchased items should be added to the collection.

5\. All reward changes must be saved.



\## 9. Data Storage Rules



Use browser localStorage to save:



\- User currency.

\- Completed daily tasks.

\- Unlocked items.

\- Placed decorations.

\- Achievement progress.



Use a consistent storage key: slowIslandState.



Keep saved data separate from static item and task definitions.



Do not overwrite existing user progress when adding new features.



\## 10. Coding Rules



\- Use HTML, CSS, and vanilla JavaScript.

\- Do not introduce frameworks unless explicitly requested.

\- Keep HTML, CSS, JavaScript, and data separate.

\- Write readable and reusable functions.

\- Avoid duplicated code.

\- Use meaningful variable and function names.

\- Handle missing or invalid saved data safely.

\- Make sure all navigation links and resource paths work on GitHub Pages.

\- Use relative paths instead of root-absolute paths.



\## 11. Responsive Design



The website must support:



\- Desktop computers.

\- Tablets.

\- Mobile phones.



Rules:

\- Navigation must remain usable on small screens.

\- Cards should adapt to screen width.

\- Buttons must be easy to tap.

\- Text must remain readable.

\- Avoid horizontal overflow.



\## 12. Rules for Adding New Features



Before adding a new page or feature, AI must:



1\. Read this AGENTS.md.

2\. Inspect the existing file structure.

3\. Understand related existing functions.

4\. Reuse existing styles and components.

5\. Follow the existing data format.

6\. Preserve existing features.

7\. Test the new feature.

8\. Update README.md if the project structure or major features change.



Examples:



When adding a new plant:

\- Follow the existing item data format.

\- Use the existing visual style.

\- Add the image to the correct folder.

\- Make sure the plant can be unlocked and displayed correctly.



When adding a new task:

\- Follow the existing task data format.

\- Use the existing task card component.

\- Make sure rewards are calculated correctly.

\- Save the completion state.



When adding a new page:

\- Follow the existing navigation and layout.

\- Reuse shared CSS.

\- Ensure responsive behavior.

\- Update navigation links when necessary.



\## 13. What AI Must Not Do



\- Do not redesign the entire website without permission.

\- Do not randomly change the color palette.

\- Do not remove existing features.

\- Do not change data formats without a clear reason.

\- Do not introduce unnecessary dependencies.

\- Do not place all code into one large file.

\- Do not use external image URLs as permanent project assets.

\- Do not break existing localStorage data.



\## 14. Final Checklist



Before completing any development task, verify:



\- Does the new feature follow AGENTS.md?

\- Is the visual style consistent?

\- Are existing features still working?

\- Are file names and paths correct?

\- Does the website work on mobile?

\- Is user progress saved correctly?

\- Does the website remain compatible with GitHub Pages?



The most important principle:



Extend the existing Slow Island project instead of rebuilding it from scratch.



