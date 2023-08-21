import React from "react";

const ViewPHR = ({phr}) => {


  return (
    <>
        <div className="py-4">
        <h2 className="text-lg font-semibold mb-4">Medical Data</h2>

      {/* Display Blood Type */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-md font-semibold mb-2">Blood Type</h3>
        <p>{phr.bloodType}</p>
      </div>

      {/* Display Allergies */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-md font-semibold mb-2">Allergies</h3>
        <p>{phr.allergies.length === 0 ? "None" : phr.allergies.join(", ")}</p>
      </div>

      {/* Display Conditions */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-md font-semibold mb-2">Conditions</h3>
        <p>{phr.conditions.length === 0 ? "None" : phr.conditions.join(", ")}</p>
      </div>

      {/* Display Medications */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-md font-semibold mb-2">Medications</h3>
        {phr.medications.length === 0 ? (
          <p>None</p>
        ) : (
          <ul>
            {phr.medications.map((medication, index) => (
              <li key={index} className="mb-2">
                <strong>{medication.name}</strong><br />
                Dosage: {medication.dosage}, Frequency: {medication.frequency}<br />
                Start Date: {medication.startDate}, Status: {medication.status}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Display Appointments */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-md font-semibold mb-2">Appointments</h3>
        {phr.appointment.length === 0 ? (
          <p>None</p>
        ) : (
          <ul>
            {phr.appointment.map((appointment, index) => (
              <li key={index} className="mb-2">
                <strong>{appointment.doctorId}</strong><br />
                Date: {appointment.date}, Diagnosis: {appointment.diagnosis}<br />
                Prescription: {appointment.prescription}, Status: {appointment.status}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ... (similar sections for other data) */}

      {/* Display Surgeries */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-md font-semibold mb-2">Surgeries</h3>
        <p>{phr.surgeries.length === 0 ? "None" : phr.surgeries.join(", ")}</p>
      </div>
        </div>
    </>
  )
};

export default ViewPHR;