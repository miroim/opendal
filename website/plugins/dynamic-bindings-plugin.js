const fs = require('fs');
const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'dynamic-bindings-plugin',

    contentLoaded({ content, actions }) {
      const { createData, addRoute } = actions;

      // Path to your bindings folder
      const bindingsDir = path.join(context.siteDir, '..', 'bindings');

      // Get all directories in the bindings folder
      const bindings = fs.readdirSync(bindingsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      // Create routes for each binding
      bindings.forEach(async (binding) => {
        // Check if README.md exists
        const readmePath = path.join(bindingsDir, binding, 'README.md');
        if (!fs.existsSync(readmePath)) {
          return;
        }

        // Determine if binding is stable or WIP (no 🚧)
        // For this example, let's assume Go, Java, Node.js, and Python are stable
        const stableBindings = ['go', 'java', 'nodejs', 'python'];
        const isStable = stableBindings.includes(binding);

        // Format title correctly
        let title = binding;
        if (binding === 'nodejs') title = 'Node.js';
        else if (binding === 'cpp') title = 'C++';
        else if (binding === 'dotnet') title = '.NET';
        else title = binding.charAt(0).toUpperCase() + binding.slice(1);

        // Create the content data
        const dataPath = await createData(
          `${binding}-data.json`,
          JSON.stringify({
            title: isStable ? title : `${title} 🚧`,
            binding: binding,
          })
        );

        // Add the route
        addRoute({
          path: `/bindings/${binding}`,
          component: '@site/src/components/BindingPage',
          exact: true,
          modules: {
            content: dataPath,
          },
        });
      });
    },
  };
};
