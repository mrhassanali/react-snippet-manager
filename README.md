🚀 React Snippet Manager is a simple yet powerful Bash-based tool that helps you store, search, and copy reusable React, Next.js, and TypeScript snippets across projects. Instead of manually searching for your custom hooks, utilities, or components in old projects, use this tool to quickly fetch and integrate them into your current project.

### ✨ Features:

1. ✅ Centralized Snippet Storage – Organize your snippets in a dedicated repository.
1. ✅ Quick Search & Copy – Find and copy snippets by name or keyword in seconds.
1. ✅ Seamless Integration – Easily move snippets into your React/Next.js projects.
1. ✅ Fuzzy Search (Planned) – Speed up searches with fzf for an even smoother experience.
1. ✅ Git Backup (Planned) – Sync your snippets with GitHub for access anywhere.

### 💡 How It Works:

1️⃣ List Available Snippets <br/>
2️⃣ Search & Select a Snippet <br/>
3️⃣ Copy It to Your Current Project <br/>

🚀 Simplify your workflow & never lose track of your code snippets again!


### How to execute the script:

1. Clone the repository
2. Run the script with the following command:

Permission to that file to execute:
```bash
chmod +x ~/react-snippet-manager/snippet-manager.sh
```

Run the script:
```bash
./snippet-manager.sh
```

### Adding into Alias of bash

Add the following line to your `~/.bashrc` or `~/.bash_profile` file:

```bash
alias react-snippet-manager="~/react-snippet-manager/snippet-manager.sh"
```

Then, run the following command to apply the changes:

```bash
source ~/.bashrc
```

Now, you can run the script by typing `react-snippet-manager` in your terminal.