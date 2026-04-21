import React from "react";

export default function ServicePrint({ record ,format}) {
    return (
        <div className="bg-slate-200 min-h-screen p-4 print:bg-white print:p-0">

            <div className="
                w-full
                max-w-[297mm]
                min-h-[297mm]
                mx-auto
                border-none
                bg-white
                shadow-xl
                p-5
                text-[11px]
                leading-tight
                print:shadow-none
                print:p-4
                overflow-hidden
            ">

                {/* HEADER */}
                <div className="flex justify-between border-b-2 border-blue-900 pb-3 mb-3 " >

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-extrabold text-blue-900">
                            KINYA<br></br>
                            <span className="font-semibold text-sm">
                                MEDICAL SYSTEMS AND SOLUTION<br/>
                                 <span className="italic text-gray-600"> Your Vision, Our Mission</span>
                            </span>
                        </h1>

                        <p>📞 +91 9789041308</p>
                        <p>✉ sales@kinya.in</p>
                        <p>🌐 www.kinya.in</p>
                    </div>

                
                    <div className="-rotate-45"><div className="w-32 h-32  font-sans  rounded-full border-4 border-green-500 text-center text-lg flex font-bold shadow-xl  shadow-green-500/20 text-green-500 justify-center items-center ">SERVICE COMPLETED <br/>KINYA</div></div>
                

                    <div className="text-right flex flex-col gap-2">
                        <p><strong>GSTIN :</strong> 33AAOFK8368D1Z2</p>
                        <p><strong>PAN :</strong> AAOFK8368D</p>
                        <p><strong>Drug License :</strong> TN-06-21B-00180</p>
                    </div>

                </div>

                {/* DOC */}
                <div className="text-right font-bold text-sm mb-2">
                    DOC NO: KMSS/QSP/40 Rev-02
                </div>

                {/* TITLE */}
                <div className="bg-blue-100
                    text-center
                    font-bold
                    text-lg
                    py-2
                    my-2
                    border
                    border-blue-900
                    rounded-md
                    text-blue-900">
                    SERVICE REPORT
                </div>

                {/* BASIC DETAILS */}
                <table className="w-full border  text-sm mb-4">
                    <tbody>

                        <tr>
                            <td className="border p-2 "><b>CSR No :</b> {record.csrNo}</td>
                            <td className="border p-2"><b>Date :</b> {record.date}</td>
                        </tr>

                        <tr>
                            <td className="border p-2"><b>Customer :</b> {record.customerName}</td>
                            <td className="border p-2"><b>Equipment :</b> {record.equipmentName}</td>
                        </tr>

                        <tr className="text-wrap">
                            <td className="border p-2"><b>Address :</b> {record.address}</td>
                            <td className="border p-2"><b>Serial No :</b> {record.serialNo}</td>
                        </tr>

                        <tr>
                            <td className="border p-2"><b>City :</b> {record.city}</td>
                            <td className="border p-2 text-wrap"><b>Manufacturer :</b> {record.manufacturer}</td>
                        </tr>

                        <tr>
                            <td className="border p-2"><b>Contact :</b> {record.customerContact}</td>
                            <td className="border p-2"><b>Model :</b> {record.model}</td>
                        </tr>

                    </tbody>
                </table>

                {/* SERVICE DETAILS */}
                <div className=" bg-blue-100
                    text-center
                    font-bold
                    text-lg
                    py-2
                    my-2
                    border
                    border-blue-900
                    rounded-md
                    text-blue-900">
                    PROBLEM / SERVICE DETAILS
                </div>

                <table className="w-full border border-black text-sm mb-4">
                    <tbody>

                        <tr>
                            <td className="border p-2">
                                <b>Problem Reported :</b><br />
                                {record.customerProblem}
                            </td>
                        </tr>

                        <tr>
                            <td className="border p-2">
                                <b>Service Rendered :</b><br />
                                {record.rectification}
                            </td>
                        </tr>

                        <tr>
                            <td className="border p-2">
                                <b>Diagnosis :</b><br />
                                {record.diagnosis}
                            </td>
                        </tr>

                    </tbody>
                </table>

                {/* SPARES */}
                <div className="font-bold mb-2 text-lg text-blue-800" >
                    Spares Replaced
                </div>

                <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
                    <thead className="bg-blue-100
                    text-center
                    font-bold
                    text-lg
                    py-2
                    mt-2
                    border
                    border-blue-900
                    rounded-md
                    text-blue-900">
                        <tr>
                            <th className="border border-gray-300 p-2">Spare</th>
                            <th className="border border-gary-300 p-2">Qty</th>
                            <th className="border border-gray-300  p-2">Cost</th>
                        </tr>
                    </thead>

                    <tbody>
                        {record.spares?.map((spare, i) => (
                            <tr key={i}>
                                <td className="border border-gray-300 p-2">{spare.spare}</td>
                                <td className="border border-gray-300 p-2">{spare.qty}</td>
                                <td className="border border-gary-300 p-2">₹{spare.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* SERVICE TIME */}
                <table className="w-full border border-black text-sm mb-4">
                    <tbody>

                        <tr>
                            <td className="border p-2"><b>Event :</b> {record.event}</td>
                            <td className="border p-2"><b>Start :</b> {format(record.startOfService)}</td>
                            <td className="border p-2"><b>End :</b> {format(record.endOfService)}</td>
                        </tr>

                    </tbody>
                </table>

                {/* REMARKS */}
                <table className="w-full border border-dark text-sm mb-4">
                    <tbody>
                        <tr>
                            <td className="border p-2">
                                <b>Remarks :</b><br />
                                {record.remarks}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* SIGNATURE */}
                <div className="grid grid-cols-3 gap-6 mt-8 text-center">

                    <div>
                        <div className="border-t border-black pt-2">
                            Engineer Signature
                        </div>
                    </div>

                    <div>
                        <div className="border-t border-black pt-2">
                            Customer Signature
                        </div>
                    </div>

                    <div>
                        <div className="border-t border-black pt-2">
                            Date / Seal
                        </div>
                    </div>

                </div>
                


                {/* FOOTER */}
                <div className="text-center mt-4 border-t pt-3 text-xs">
                    Thank you for doing business with us
                    <p>
                        Plot No.55 Mahalakshmi Nagar, Guduvanchery, Chennai - 603202
                    </p>
                </div>

            </div>
        </div>
    );
}