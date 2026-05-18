import { Link } from "react-router-dom";

const ErrorState = ( {title, message, link, linkText} ) => {
  return (
    <div>
        <h2> {title} </h2>
        <p> {message} </p>
        {link && <Link to={link}> {linkText} </Link> }
    </div>
  );
}

export default ErrorState