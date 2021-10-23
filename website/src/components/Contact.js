import styles from "./Contact.module.css";

function Contact() {
    return (
        <div id="Contact">
            <h3>Contact</h3>
            <div className={styles.contact}>
                <a href="https://facebook.com/mv5903" target="_blank" rel="norefferer">
                    <img
                        title="Matthew Vandenberg on Facebook"
                        src="https://cdn.jsdelivr.net/npm/simple-icons@5.12.0/icons/facebook.svg"
                    />
                </a>
                <a href="https://twitter.com/kwikmatt" target="_blank" rel="norefferer">
                    <img
                        title="@kwikmatt on Twitter"
                        src="https://cdn.jsdelivr.net/npm/simple-icons@5.12.0/icons/twitter.svg"
                    />
                </a>
                <a href="https://instagram.com/kwikmatt" target="_blank" rel="norefferer">
                    <img
                        title="@kwikmatt on Instagram"
                        src="https://cdn.jsdelivr.net/npm/simple-icons@5.12.0/icons/instagram.svg"
                    />
                </a>
                <a
                    href="https://www.youtube.com/channel/UCpxpQXZCLXvVk5N9bZIvhBw?view_as=subscriber"
                    target="_blank"
                    rel="norefferer"
                >
                    <img
                        title="Matthew Vandenberg on YouTube"
                        src="https://cdn.jsdelivr.net/npm/simple-icons@5.12.0/icons/youtube.svg"
                    />
                </a>
                <a
                    href="https://linkedin.com/in/matthew-vandenberg-2a9022172"
                    target="_blank"
                    rel="norefferer"
                >
                    <img
                        title="Matthew Vandenberg on LinkedIn"
                        src="https://cdn.jsdelivr.net/npm/simple-icons@5.12.0/icons/linkedin.svg"
                    />
                </a>
                <a href="mailto:questions@mattvandenberg.com" target="_blank" rel="norefferer">
                    <img
                        title="Email Matthew Vandenberg"
                        src="https://cdn.jsdelivr.net/npm/simple-icons@5.12.0/icons/gmail.svg"
                    />
                </a>
                <a href="https://github.com/mv5903" target="_blank" rel="norefferer">
                    <img
                        title="Matthew Vandenberg on GitHub"
                        src="https://cdn.jsdelivr.net/npm/simple-icons@5.12.0/icons/github.svg"
                    />
                </a>
            </div>
        </div>
    );
}

export default Contact;
