import {
    Box,
    FormControl,
    FormLabel,
    Button,
    VStack,
    Input,
    Text,
    Flex,
  } from '@chakra-ui/react'

import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { loginUser,user } = useAuth();
    const nav = useNavigate();

    const handleLogin = async () => {
        await loginUser(username, password)
    }

    const handleNavigate = () => {
        nav('/register')
    }
    useEffect(() => {
        const getAuth = async () => {
            if(user){
             nav('/home');
    };
        
        }
        getAuth();
    }, [])

    return (
        // <VStack minH='500px' w='70%' maxW='400px' justifyContent='start' alignItems='start'>
        //     <Text mb='20px' color='gray.700' fontSize='44px' fontWeight='bold'>Login</Text>
        //     <FormControl mb='20px'>
        //         <FormLabel>Username</FormLabel>
        //         <Input bg='white' onChange={(e) => setUsername(e.target.value)} value={username} type='email' placeholder='Your username here' />
        //     </FormControl>
        //     <FormControl>
        //         <FormLabel>Password</FormLabel>
        //         <Input  bg='white' onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='Your password here' />
        //     </FormControl>
        //     <Button mb='10px' colorScheme='green' mt='20px' w='100%' onClick={handleLogin}>Login</Button>
        //     <Text onClick={handleNavigate} cursor='pointer' color='gray.600' fontSize='14px'>Don't have an account? Sign up</Text>
        // </VStack>
        <Box 
      w="100vw"
      h="100vh"
      bgImage="url('/images/bg.jpg')" // Background image
      bgSize="cover"
      bgPosition="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {/* Login Form Box */}
      <Flex 
        direction="column" 
        bg="rgba(0, 0, 0, 0.6)" // Semi-transparent background
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        color="white"
        w={["90%", "400px"]} // Responsive width
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>Login</Text>
        
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input 
            bg="rgba(255, 255, 255, 0.2)" 
            color="white"
            border="1px solid gray"
            _placeholder={{ color: "gray.400" }}
            _focus={{ borderColor: "red.500", bg: "rgba(255, 255, 255, 0.3)" }}
            onChange={(e) => setUsername(e.target.value)} 
            value={username} 
            type="text" 
            placeholder="Your username here" 
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input 
            bg="rgba(255, 255, 255, 0.2)" 
            color="white"
            border="1px solid gray"
            _placeholder={{ color: "gray.400" }}
            _focus={{ borderColor: "red.500", bg: "rgba(255, 255, 255, 0.3)" }}
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            type="password" 
            placeholder="Your password here" 
          />
        </FormControl>

        <Button colorScheme="red" w="100%" mt={4} onClick={handleLogin}>Login</Button>

        <Text mt={4} textAlign="center" fontSize="sm">
          Don't have an account? <Text as="span" color="red.300" cursor="pointer" onClick={handleNavigate}>Sign up</Text>
        </Text>
      </Flex>
    </Box>


    )
}

export default Login;