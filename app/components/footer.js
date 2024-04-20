'use client'
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { FaLinkedinIn } from 'react-icons/fa';
import '../styles/footer.css';

function Footer() {
    const [formData, setFormData] = useState({
        from_name: '',
        from_email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                formData
            );
            console.log('SUCCESS!', result.status, result.text);
            setFormData({
                from_name: '',
                from_email: '',
                message: ''
            });
            setSubmitted(true);
        } catch (error) {
            console.log('FAILED...', error);
            alert('Failed to send the message, please try again.');
        }
    };

    return (
        <footer className="footer" id='footer'>
            <div className="footer-content">
                <h3>Let's Connect!</h3>
                {submitted ? (
                    <p>Thanks for reaching out! I'll get back to you soon.</p>
                ) : (
                    <>
                        <p>If you have any questions or just want to connect, don't hesitate to reach out.</p>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <label htmlFor="from_name">Name:
                                    <input type="text" id="from_name" name="from_name" value={formData.from_name} onChange={handleChange} />
                                </label>
                                <label htmlFor="from_email">Email:
                                    <input type="email" id="from_email" name="from_email" value={formData.from_email} onChange={handleChange} />
                                </label>
                            </div>
                            <label htmlFor="message">Message:
                                <textarea id="message" name="message" value={formData.message} onChange={handleChange} />
                            </label>
                            <button type="submit">Send</button>
                        </form>
                    </>
                )}
                <a href="https://www.linkedin.com/in/waltdejong0/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedinIn size={30} />
                </a>
            </div>
        </footer>
    );
}

export default Footer;
