import "./Portfolio.css";

const Education = () => {
	return (
		<section className="section container education-section" id="education">
			<h2 className="section-title">Education</h2>
			<div className="education-card">
				{/* <!-- Left side: logo --> */}
				<div className="edu-logo">
					<img src="images/byuLogo.png" alt="Brigham Young University logo" />
				</div>

				{/* <!-- Right side: details --> */}
				<div className="edu-details">
					<h3 className="edu-school">Brigham Young University — Expected May 2027</h3>
					<em>
						<p className="edu-location">Provo, UT</p>
					</em>
					<p className="edu-degree">Computer Science</p>
					<p className="edu-gpa">
						<strong>GPA:</strong> 3.97
					</p>
					<div className="edu-coursework">
						<strong>Relevant coursework:</strong>
						<ul>
							<li>Web Programming</li>
							<li>Advanced Software Construction</li>
							<li>Software Design</li>
						</ul>
					</div>
					<p className="edu-awards">
						<strong>Awards:</strong> BYU Academic Scholarship
					</p>
					<p className="edu-clubs">
						<strong>Clubs:</strong> BYU Developers Club
					</p>
				</div>
			</div>
		</section>
	);
};

export default Education;
