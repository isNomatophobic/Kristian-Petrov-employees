import LinkedIn from "../assets/linkedin.svg?react";
import Github from "../assets/github.svg?react";
import Instagram from "../assets/instagram.svg?react";

const Socials = () => {
  return (
    <div id="socials">
      <a
        target="_blank"
        href="https://www.linkedin.com/in/kristian-petrov-027840220/"
      >
        <LinkedIn />
      </a>
      <a target="_blank" href="https://github.com/isNomatophobic">
        <Github />
      </a>

      <a target="_blank" href="https://www.instagram.com/krispaneca/">
        <Instagram />
      </a>
    </div>
  );
};
export default Socials;
