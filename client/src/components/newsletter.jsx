import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted email:', email);
    // You would typically send this to your backend
    setEmail('');
  };

  return (
    <section className="section-p1 section-m1" id="newsletter">
      <div className="newstext">
        <h4>Sign Up For Newsletters</h4>
        <p>
          Get E-mail updates about our latest shop and <span>special offers.</span>
        </p>
      </div>
      <div className="form">
        <input 
          type="text" 
          placeholder="Your email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="normal" onClick={handleSubmit}>Sign Up</button>
      </div>
    </section>
  );
};

export default Newsletter;