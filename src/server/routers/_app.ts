// import { z } from "zod";
// import { procedure, middleware, router } from "../trpc";

// export const appRouter = router({
//   hello: procedure
//     .input(
//       z.object({
//         text: z.string(),
//       })
//     )
//     .query(({ input }) => {
//       return {
//         greeting: `hello ${input.text}`,
//       };
//     }),
//   convertTrack: procedure
//     .input(z.object({ file: z.any() }))
//     .query(({ file }) => {
//       console.log(file);
//       return {
//         title: "Marble Soda",
//         difficulty: 5.09,
//         approachRate: 9,
//         notes: [
//           {
//             path: 0,
//             time: 1168,
//             type: 6,
//             hitSound: 0,
//           },
//         ],
//         breaks: [
//           {
//             startTime: 23867,
//             endTime: 28782,
//           },
//         ],
//         bgImage: "MarbleSodaBG.jpg",
//       };
//     }),
// });

// // export type definition of API
// export type AppRouter = typeof appRouter;
