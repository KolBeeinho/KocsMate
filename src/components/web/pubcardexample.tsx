// {pubs.length > 0 && (
//     <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
//       <h3 className="text-xl font-semibold">Pubok listája</h3>
//       <ul>
//         {pubs.map((pub) => (
//           <li
//             key={pub.id}
//             className={`my-2 ${
//               pub.state !== "func" ? "text-gray-500" : ""
//             }`}
//           >
//             <h4 className="font-medium">{pub.name}</h4>
//             <p>{pub.fullAddress}</p>
//             <a
//               href={pub.href}
//               target="_blank"
//               className="text-blue-500 block"
//             >
//               {pub.href}
//             </a>
//             <a
//               href={`tel:${pub.phone}`}
//               className="text-blue-500 block"
//             >
//               {pub.phone}
//             </a>
//             <a href={`mailto:${pub.email}`} className="block">
//               {pub.email}
//             </a>
//             <p>{pub.state}</p>
//             <p>{pub.googleRating}</p>
//             <p>{pub.rating}</p>
//             {/* Vélemények megjelenítése */}
//             {pub.reviews && pub.reviews.length > 0 && (
//               <div className="mt-4">
//                 <h5 className="font-semibold">Vélemények</h5>
//                 <ul>
//                   {pub.reviews.map((review: Review) => (
//                     <li
//                       key={review.id}
//                       className={`${!review.isActive && "hidden"} my-2`}
//                     >
//                       <p>
//                         <strong>Értékelés:</strong> {review.userId} / 5
//                       </p>
//                       <p>
//                         <strong>Értékelés:</strong> {review.rating} / 5
//                       </p>
//                       <p>
//                         <strong>Vélemény:</strong> {review.comment}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}
