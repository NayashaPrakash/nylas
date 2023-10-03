// EmailDetail.js
import React from 'react';

function EmailDetail({ selectedEmail }) {
  // Assuming you have selectedEmail.emailBody or a similar property
  const emailBody = selectedEmail.emailBody;

  return (
    <div className="email-detail">
      <h2>Email Detail</h2>
      <p>{emailBody}</p>
    </div>
  );
}

export default EmailDetail;
