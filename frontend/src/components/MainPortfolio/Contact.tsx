import { useState } from "react";

type SubmitStatus = "idle" | "success" | "error";

const Contact = () => {
	const [status, setStatus] = useState<SubmitStatus>("idle");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // Stop page refresh
		const form = e.currentTarget;

		const formData = new FormData(form);
		formData.append("access_key", "7ecc7965-ead4-4b75-922c-1eef7095a338");

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					Accept: "application/json",
				},
				body: formData,
			});

			const result = await response.json();

			if (result.success) {
				form.reset(); // Clears the form
				setStatus("success");
			} else {
				console.error(result);
				setStatus("error");
			}
		} catch (error) {
			console.error(error);
			setStatus("error");
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
				{status === "success" && (
					<p className="form-status form-status--success">Message sent! I'll get back to you soon.</p>
				)}
				{status === "error" && (
					<p className="form-status form-status--error">
						Something went wrong sending your message. Please try again later.
					</p>
				)}
			</form>
		</section>
	);
};

export default Contact;
