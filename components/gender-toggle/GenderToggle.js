import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./GenderToggle.module.scss";
import ICONS from "../icon/IconPaths";

const GenderToggle = ({ gender, changeGender }) => {
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 1000, hide: 200 }}
      overlay={<Tooltip id="gender-toggle-tooltip">Toggle gender</Tooltip>}
    >
      <button
        onClick={() => changeGender(gender)}
        className={`${styles.genderSwitchWrapper}`}
        style={{
          padding: "12px",
          gap: "19px",
          width: "82px",
          height: "44px",
        }}
      >
        <div
          className={`${styles.genderSwitchStyles} ${
            gender == "male"
              ? styles.genderSwitchStylesMale
              : styles.genderSwitchStylesFemale
          } position-absolute bg-light-900 radius-5`}
          style={{ top: "2px", height: "40px", width: "40px" }}
        ></div>
        <svg
          className={`${styles.genderSwitchMaleIcon} ${
            gender == "male" && styles.active
          }`}
          style={{ zIndex: "1" }}
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fillRule="evenodd" clipRule="evenodd" d={ICONS.MALE} />
        </svg>
        <svg
          className={`${styles.genderSwitchFemaleIcon} ${
            gender == "female" && styles.active
          }`}
          style={{ zIndex: "1" }}
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fillRule="evenodd" clipRule="evenodd" d={ICONS.FEMALE} />
        </svg>
      </button>
    </OverlayTrigger>
  );
};

export default GenderToggle; 