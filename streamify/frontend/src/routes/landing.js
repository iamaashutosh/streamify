// import React from "react";
// import "../assets/css/landing.css";
// import { useNavigate } from "react-router-dom";
// const LandingPage=()=>{

//     const navigate = useNavigate();

//     const handleGetStarted = () => {
//         navigate('/login'); 

//     };
//     const handleSignup=()=>{
//         navigate('/register')
//     }
// return(
// <div className="landing-page">
//       <div className="landing-navbar">
//         <div className="landing-logo">NepFlix</div>
//         <div className="nav-buttons">
//           <button className="login-button" onClick={handleGetStarted}>Login</button>
//           <button className="signup-button" onClick={handleSignup}>Register</button>
//         </div>
//       </div>
//       <div className="background-overlay">
//         <div className="content">
//           <h1 className="headline">Unlimited movies, TV shows, and more.</h1>
//           <h2 className="subheadline">Watch anywhere. Cancel anytime.</h2>
//           <p className="cta-text">
//             Ready to watch? Enter your email to create or restart your membership.
//           </p>
//             <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
//         </div>
//       </div>
//     </div>
// );
// }

// export default LandingPage
import React from "react";
import { Box, Button, Text, VStack, Flex, ChakraProvider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <ChakraProvider>
      <Box 
        bgImg="url('/images/bg.jpg')"
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        className="landing-page"
        color="white"
        minH="100vh"
        minWidth={'100vw'}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={6}
        position="relative"
      >
        {/* Navbar */}
        <Flex 
          justify="space-between" 
          align="center" 
          w="full" 
          px={10} 
          py={4} 
          position="absolute"
          top={0}
          left={0}
          zIndex={2}
          bg="rgba(0, 0, 0, 0.7)" // Dark transparent background
          backdropFilter="blur(5px)" 
        >
          <Text fontSize="3xl" fontWeight="bold" color="red.500">NepFlix</Text>
          <Flex gap={4}>
            <Button colorScheme="red" variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button colorScheme="red" variant="solid" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Flex>
        </Flex>

        {/* Background Overlay */}
        <Box 
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          //bg="../assets/images/bg (1).jpg"
          zIndex={1}
        />

        {/* Main Content */}
        <VStack 
          spacing={4} 
          zIndex={2} 
          maxW="lg"
          mx="auto"
          textAlign="center"
        >
          <Text fontSize="4xl" fontWeight="bold">Unlimited movies, TV shows, and more.</Text>
          <Text fontSize="xl">Watch anywhere. Cancel anytime.</Text>
          <Text fontSize="lg">Ready to watch? Enter your email to create or restart your membership.</Text>
          <Button size="lg" colorScheme="red" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default LandingPage;
