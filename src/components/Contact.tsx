import "./Portfolio.css";

const Contact = () => {
	return (
		<section className="section container" id="contact">
			<h2 className="section-title">Contact</h2>
			<form className="contact-form" action="#" method="post">
				<input className="form-input" type="text" name="name" placeholder="Your name" required />
				<input className="form-input" type="email" name="email" placeholder="Email address" required />
				<textarea className="form-input" name="message" placeholder="Your message" required></textarea>
				<button className="btn btn-primary" type="submit">
					Send message
				</button>
			</form>
		</section>
	);
};

export default Contact;
