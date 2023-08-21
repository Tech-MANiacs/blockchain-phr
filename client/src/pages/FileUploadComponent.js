import { Fragment, useState } from "react";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import FileUpload from "./FileUpload";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const FileUploadComponent = () => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Fragment>
      <Accordion open={open === 1} icon={<Icon id={1} open={open} />} className="bg-white text-md">
        <AccordionHeader onClick={() => handleOpen(1)} className="text-md py-1">File Upload</AccordionHeader>
        <AccordionBody>
          <FileUpload label="dmc" />
        </AccordionBody>
      </Accordion>
    </Fragment>
  );
};

export default FileUploadComponent;