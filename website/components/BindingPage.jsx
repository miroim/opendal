import Layout from '@theme/Layout';
import GitHubReadme from '@site/components/GitHubReadme';

export default function BindingPage(props) {
  const { content } = props;
  const { title, binding } = content;

  // Dynamically import the README content
  const Content = require(`../../../bindings/${binding}/README.md`).default;

  return (
    <Layout title={title}>
      <main className="container margin-vert--lg">
        <h1>{title}</h1>
        <GitHubReadme basePath={`bindings/${binding}/`}>
          <Content components={{ h1: 'h2' }} />
        </GitHubReadme>
      </main>
    </Layout>
  );
}
