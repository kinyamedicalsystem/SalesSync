import React from "react";

export default function InstallationPrint({ record, format }) {
    return (
        <div className="bg-slate-200  p-4 print:bg-white print:p-0">

            <div className="
                w-[210mm]
                max-h[297mm]
                min-h-[297mm]
                mx-auto
                bg-white
                shadow-xl
                border
                border-blue-900
                p-[8mm]
                print:shadow-none
                print:border-none
                print:p-[6mm]
            ">
                {/* HEADER */}
                <div className="flex justify-between border-b-2 border-blue-900 pb-3 mb-3 ">

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-extrabold text-blue-900">
                            KINYA<br></br>
                            <span className="font-semibold text-sm">
                                MEDICAL SYSTEMS AND SOLUTION<br />
                                <span className="italic text-gray-600"> Your Vision, Our Mission</span>
                            </span>
                        </h1>
                        <p>📞 +91 9789041308</p>
                        <p>✉ sales@kinya.in</p>
                        <p>🌐 www.kinya.in</p>
                    </div>


                    <div className="-rotate-45"><div className="w-32 h-32  font-sans  rounded-full border-4 border-green-500 text-center text-lg flex font-bold shadow-xl  shadow-green-500/20 text-green-500 justify-center items-center ">INS COMPLETED <br />KINYA</div></div>


                    <div className="text-right flex flex-col gap-2">
                        <p><strong>GSTIN :</strong> 33AAOFK8368D1Z2</p>
                        <p><strong>PAN :</strong> AAOFK8368D</p>
                        <p><strong>Drug License :</strong> TN-06-21B-00180</p>
                    </div>

                </div>

                {/* TITLE */}
                <div className="
                    bg-blue-100
                    text-center
                    font-bold
                    text-xl
                    py-2
                    mt-3
                    border
                    border-blue-900
                    rounded-md
                    text-blue-900
                ">
                    INSTALLATION REPORT
                </div>

                {/* CUSTOMER + INVOICE */}
                <section className="mt-4">
                    <h2 className="font-bold text-blue-900 text-lg border-b pb-1 mb-2">
                        Customer & Invoice Information
                    </h2>

                    <div className="grid grid-cols-2 gap-3 text-sm">

                        <div className="border p-2 rounded bg-slate-50">
                            <strong>Date :</strong> {record.date}
                        </div>

                        <div className="border p-2 rounded bg-slate-50">
                            <strong>Invoice No : </strong> {record.invoiceNo}
                        </div>

                        <div className="border p-4 rounded text-wrap bg-slate-50">
                            <strong>Customer : </strong> {record.customerName}<br></br>
                            <span className="text-gray-600 text-sm mt-2"><i className="fas fa-phone text-sm me-2"></i>{record.customerContact}</span>
                        </div>

                        <div className="border p-4 rounded bg-slate-50">
                            <strong>Engineer : </strong> {record.engineerName}<br></br>
                            <span className="text-gray-600 text-sm mt-2"><i className="fas fa-phone text-sm me-2"></i>{record.engineerContact}</span>
                        </div>

                        <div className="border p-2 rounded bg-slate-50">
                            <strong>Invoice Date : </strong> {record.invoiceDate}
                        </div>

                        <div className="border p-2 rounded bg-slate-50">
                            <strong>City : </strong> {record.city}
                        </div>

                        <div className="border p-3 text-wrap rounded bg-slate-50 col-span-2 ">
                            <strong>Address : </strong> {record.address}
                        </div>

                    </div>
                </section>

                {/* ITEM TABLE */}
                <section className="mt-4">
                    <h2 className="font-bold text-blue-900 text-lg border-b pb-1 mb-2">
                        Equipment Details
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border text-sm">

                            <thead>
                                <tr className="bg-blue-100
                              text-center 
                              font-bold 
                              text-xl
                              py-2
                              mt-3
                              border
                              border-blue-900
                              rounded-md
                              text-blue-900">
                                    <th className="border p-3">#</th>
                                    <th className="border p-3">Item</th>
                                    <th className="border p-3">Manufacturer</th>
                                    <th className="border p-3">Serial</th>
                                    <th className="border p-3">Model</th>
                                    <th className="border p-3">Qty</th>
                                </tr>
                            </thead>

                            <tbody>
                                {record.items?.map((item, i) => (
                                    <tr
                                        key={i}
                                        className={i % 2 === 0 ? "bg-slate-50" : ""}
                                    >
                                        <td className="border p-2">{i + 1}</td>
                                        <td className="border p-2">{item.item}</td>
                                        <td className="border p-2">{item.manufacturer}</td>
                                        <td className="border p-2">{item.serial}</td>
                                        <td className="border p-2">{item.model}</td>
                                        <td className="border p-2">{item.qty}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </section>

                {/* INSTALLATION DETAILS */}
                <section className="mt-4">
                    <h2 className="font-bold text-blue-900 text-lg border-b pb-1 mb-2">
                        Installation Details
                    </h2>

                    <div className="grid grid-cols-2 gap-3 text-sm">

                        <div className="border p-3 rounded  bg-slate-50">
                            <strong>Warranty:</strong> {record.warranty} Years
                        </div>

                        <div className="border p-3 rounded bg-slate-50">
                            <strong>Demo Given : </strong> {record.demoGiven}
                            <strong className="ms-5">Training Given:</strong> {record.trainingGiven}
                        </div>


                        <div className="border p-3 rounded bg-slate-50 col-span-2">
                            (Event) <span className="text-green">  <strong>Start :</strong> {format(record.eventStart)}</span> → <span><strong>End :</strong> {format(record.eventEnd)}</span>
                        </div>
                        <div className="border p-3 rounded bg-slate-50">
                            <strong>Customer Signature : </strong>
                        </div>
                        <div className="border p-3 rounded bg-slate-50">
                            <strong>Engineer Signature : </strong>
                        </div>

                    </div>
                </section>

                {/* CERTIFICATE */}
                <div className="
                    mt-2
                    bg-green-50
                    border-l-4
                    border-green-700
                    p-4
                    rounded
                    text-sm
                    font-medium
                ">
                    ✔ This is to certify that the product was installed successfully
                    with all accessories and is working satisfactorily.
                </div>

                {/* FOOTER */}
                <div className="mt-3 text-center text-xs border-t pt-4 text-gray-600">
                    Thank you for choosing Kinya Medical Systems
                    <p>
                        Plot No.55 Mahalakshmi Nagar, Guduvanchery, Chennai - 603202
                    </p>
                </div>

            </div>
        </div>
    );
}