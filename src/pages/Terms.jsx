import React from 'react';
import { PageTransition, ScrollReveal } from '../components/ScrollReveal';

const Terms = () => {
  return (
    <PageTransition>
      <div className="page-shell page-top-space white-main">
        <section className="section-padding surface-white">
          <div className="container">
            <ScrollReveal>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
                <p className="section-kicker">Legal</p>
                <h1 className="section-title" style={{ textAlign: 'left' }}>Terms of Service</h1>
              </div>
            </ScrollReveal>

            <div style={{ maxWidth: '800px' }}>
              <ScrollReveal>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-dark-gray)', marginBottom: '24px' }}>
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', marginTop: '24px' }}>1. Agreement to Terms</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)' }}>
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', marginTop: '24px' }}>2. Use License</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)', marginBottom: '12px' }}>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Velanova's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul style={{ paddingLeft: '20px', fontSize: '1rem', color: 'var(--color-dark-gray)', lineHeight: '1.7' }}>
                    <li>Modifying or copying the materials</li>
                    <li>Using the materials for any commercial purpose or for any public display</li>
                    <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                    <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                    <li>Removing any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', marginTop: '24px' }}>3. Disclaimer</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)' }}>
                    The materials on Velanova's website are provided on an 'as is' basis. Velanova makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', marginTop: '24px' }}>4. Limitations</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)' }}>
                    In no event shall Velanova or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Velanova's website, even if Velanova or an authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', marginTop: '24px' }}>5. Accuracy of Materials</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)' }}>
                    The materials appearing on Velanova's website could include technical, typographical, or photographic errors. Velanova does not warrant that any of the materials on the website are accurate, complete, or current. Velanova may make changes to the materials contained on the website at any time without notice.
                  </p>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', marginTop: '24px' }}>6. Links</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)' }}>
                    Velanova has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Velanova of the site. Use of any such linked website is at the user's own risk.
                  </p>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', marginTop: '24px' }}>7. Modifications</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)' }}>
                    Velanova may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', marginTop: '24px' }}>8. Governing Law</h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-dark-gray)' }}>
                    These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Velanova operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                  </p>
                </div>

                <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #eee' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-gray)' }}>
                    If you have any questions about these Terms of Service, please contact us at support@velanova.com
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Terms;
