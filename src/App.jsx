// import styled from "styled-components";
// import GlobalStyles from "./styles/GlobalStyles";
// import Button from "./ui/Button";
// import Input from "./ui/Input";
// import Heading from "./ui/Heading";
// import Row from "./ui/Row";

// // Below is a way of using styles with styled components. It returns a react component which can be used by us.
// // These below styled components are just like regular react components.
// // What you have written after 'styled' is regular html element, and the name of the component can be anything.
// // const H1 = styled.h1`
// //   font-size: 30px;
// //   font-weight: 600;
// //   background-color: yellow;
// // `;

// // Below is a way of styling the app component itself.
// const StyledApp = styled.div`
//   /* background-color: orangered; */
//   padding: 20px;
// `;

// function App() {
//   return (
//     <>
//       {/* Below is a global style component which is defined in styles folder. This component can't have any children so we have made it a sibling of the main component and wrapped the entire thing in a react fragement.*/}
//       <GlobalStyles />
//       <StyledApp>
//         <Row>
//           <Row type="horizontal">
//             <Heading type="h1">The wild oasis</Heading>

//             <div>
//               <Button
//                 variation="primary"
//                 size="medium"
//                 onClick={() => alert("Check In")}
//               >
//                 Check In
//               </Button>
//               <Button
//                 variation="secondary"
//                 size="small"
//                 onClick={() => alert("Check out")}
//               >
//                 Check out
//               </Button>
//             </div>
//           </Row>

//           <Row type="vertical">
//             {/* With the help of 'as' prop the below styled component will be rendered as whatever html component that you have specified here, 'h3' in this case. */}
//             <Heading as="h3">Form</Heading>

//             <div>
//               <Input type="number" placeholder="Number of guests"></Input>
//               <Input type="number" placeholder="Number of guests"></Input>
//             </div>
//           </Row>
//         </Row>
//       </StyledApp>
//     </>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { DarkModeProvider } from "./context/DarkModeContext";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import Booking from "./pages/Booking";
import Checkin from "./pages/Checkin";
import CreateBooking from "./pages/CreateBooking";

// Creating a client.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Amount of time until data in the cachce will stay valid, until it is refetched again. It will only be refetched when you switch to another tab.
      // in milliseconds
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      {/* // Providing react-query-client to our app. */}
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Below is the 'index' route meaning that if you haven't defined which route to use this will be used. 'Navigate' 'replace' is used to change the url. */}
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="bookings/:bookingId" element={<Booking />} />
              <Route
                path="bookings/createBooking"
                element={<CreateBooking />}
              />
              <Route path="checkin/:bookingId" element={<Checkin />} />

              <Route path="users" element={<Users />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>

          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: { duration: 5000 },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-gey-700)",
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
