import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ProjectCard = ({ 
  logo, 
  name, 
  description, 
  technologies,
  url
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="d-flex flex-column align-items-start gap-4">
      <div className="d-flex flex-column flex-md-row align-items-start gap-4">
        <img
          src={logo.src}
          alt={logo.alt}
          className="image-ff rotate-1 radius-3 order-0"
          style={{ zIndex: 1, width: "64px", minWidth: "64px" }}
        />
        <div>
          <h5 
            className="mb-2" 
            style={{ lineHeight: "1.2" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                {name}
                <span 
                  style={{ 
                    marginLeft: "8px",
                    opacity: isHovering ? 1 : 0,
                    transform: isHovering ? "translateX(0)" : "translateX(-10px)",
                    transition: "opacity 0.3s, transform 0.3s",
                    display: "inline-block"
                  }}
                >
                  →
                </span>
              </a>
            ) : (
              <>
                {name}
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="building-tooltip">Under construction</Tooltip>}
                >
                  <span 
                    style={{ 
                      marginLeft: "4px",
                      opacity: isHovering ? 1 : 0,
                      transform: isHovering ? "translateX(0)" : "translateX(-10px)",
                      transition: "opacity 0.3s, transform 0.3s",
                      display: "inline-block"
                    }}
                  >
                    🚧
                  </span>
                </OverlayTrigger>
              </>
            )}
          </h5>
          <h6
            className="text-dark-low mb-0"
            style={{ marginTop: "-4px" }}
            // style={{ lineHeight: "1.2" }}
          >
            {description}
          </h6>
          <div className="mt-3">
            {technologies.map((tech, index) => (
              <OverlayTrigger
                key={tech.id}
                placement="top"
                overlay={<Tooltip id={`${tech.id}-tooltip`}>{tech.name}</Tooltip>}
              >
                <img
                  width="24"
                  src={tech.icon}
                  alt={tech.name}
                  className="image-ff small rotate-1 radius-3 position-relative"
                  style={{ 
                    marginLeft: index > 0 ? "-4px" : "0", 
                    zIndex: 5 - index 
                  }}
                />
              </OverlayTrigger>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 