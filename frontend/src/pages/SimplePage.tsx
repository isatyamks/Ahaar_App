import React from 'react';
import Layout from '../components/layout/Layout';

const SimplePage: React.FC<{ title: string; description?: string }>= ({ title, description }) => (
  <Layout>
    <section className="py-20" style={{ background: 'var(--ah-bg)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold" style={{ color: 'var(--ah-secondary)' }}>{title}</h1>
        {description && <p className="mt-2" style={{ color: 'var(--ah-text-muted)' }}>{description}</p>}
        <div className="mt-8 card p-6">
          <p className="text-sm" style={{ color: 'var(--ah-text-muted)' }}>Content coming soon.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default SimplePage;
