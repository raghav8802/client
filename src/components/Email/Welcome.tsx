import React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#333' }}>
    <h1 style={{ color: '#1d72b8' }}>Welcome to SwaLay, {firstName}!</h1>
    <p>
      We are thrilled to have you on board. Thank you for joining our community. At SwaLay, we are committed to providing you with the best experience, and we are here to support you every step of the way.
    </p>
    <p>
      If you have any questions or need assistance, please do not hesitate to reach out to us at <a href="swalay.care@talantoncore.in">itadmin@talantoncore.in</a>.
    </p>
    <p>
      Best regards,<br />
      SwaLay Team
    </p>
  </div>
);