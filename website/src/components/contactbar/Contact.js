import styles from "./Contact.module.css";
import { contactDetails } from "../assets/contactDetails";
import ContactItem from "./ContactItem";

export default function Contact() {
    return (
        <div id="Contact">
            <h3>Contact</h3>
            <div className={styles.contact}>
                {
                    contactDetails.map(contactItem => {
                        return (
                        <ContactItem
                            href={contactItem.href}
                            src={contactItem.src}
                            title={contactItem.title}
                            key={contactItem.key}
                        />
                        )
                    })
                }
            </div>
        </div>
    );
}
