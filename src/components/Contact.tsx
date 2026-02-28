import "./Portfolio.css";

const Contact = () => {
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // Stop page refresh
		const form = e.currentTarget;

		const formData = new FormData(form);

		const data = {
			name: formData.get("name"),
			email: formData.get("email"),
			message: formData.get("message"),
		};

		try {
			await fetch(
				"https://script.google.com/macros/s/AKfycbxMmUvKrrXq-mXgDPkpCEHeGUslF247HKCpiifTX-841OgvXr2fm_17kffDojPYF-xM/exec",
				{
					method: "POST",
					mode: "no-cors",
					body: JSON.stringify(data),
				}
			);

			form.reset(); // Clears the form
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<section className="section container" id="contact">
			<h2 className="section-title">Contact</h2>
			<form className="contact-form" action="#" method="post" onSubmit={handleSubmit}>
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
