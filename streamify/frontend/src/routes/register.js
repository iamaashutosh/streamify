import {
    Box,
    Flex,
    FormControl,
    FormLabel,
    Button,
    VStack,
    Input,
    Text,
  } from '@chakra-ui/react'

import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [username, setUsername] = useState('')
    const[first_name,setFirstName]=useState('')
    const[last_name,setLastname]=useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const { registerUser } = useAuth();
    const nav = useNavigate();
    const [isValid, setIsValid] = useState(true);

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setIsValid(validateEmail(value) || value === "");
    };

    const handleRegister = async () => {
        await registerUser(username,first_name,last_name, email, password, passwordConfirm)
    }

    const handleNavigate = () => {
        nav('/login')
    }

    return (
        <Box 
              w="100vw"
              h="200vh"
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
                w={["90%", "400px"]}
                marginTop="150px" // Responsive width
              >
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>Register</Text>
                
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
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    bg="rgba(255, 255, 255, 0.2)" 
                    color="white"
                    border="1px solid gray"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{ borderColor: "red.500", bg: "rgba(255, 255, 255, 0.3)" }}
                    onChange={(e) => setFirstName(e.target.value)} 
                    value={first_name} 
                    type="text" 
                    placeholder="Your username here" 
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    bg="rgba(255, 255, 255, 0.2)" 
                    color="white"
                    border="1px solid gray"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{ borderColor: "red.500", bg: "rgba(255, 255, 255, 0.3)" }}
                    onChange={(e) => setLastname(e.target.value)} 
                    value={last_name} 
                    type="text" 
                    placeholder="Your username here" 
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    bg="rgba(255, 255, 255, 0.2)" 
                    color="white"
                    border="1px solid gray"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{ borderColor: "red.500", bg: "rgba(255, 255, 255, 0.3)" }}
                    onChange={handleChange} 
                    value={email} 
                    type="email" 
                    placeholder="Your username here" 
                  />
                  {!isValid && (
                    <Text color="red.400" fontSize="sm" mt={1}>
                    Please enter a valid email address.
                    </Text>
                    )}
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
                <FormControl mb={4}>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input 
                    bg="rgba(255, 255, 255, 0.2)" 
                    color="white"
                    border="1px solid gray"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{ borderColor: "red.500", bg: "rgba(255, 255, 255, 0.3)" }}
                    onChange={(e) => setPasswordConfirm(e.target.value)} 
                    value={passwordConfirm} 
                    type="password" 
                    placeholder="Your password here" 
                  />
                </FormControl>
        
                <Button colorScheme="red" w="100%" mt={4} onClick={handleRegister}>Login</Button>
        
                <Text mt={4} textAlign="center" fontSize="sm">
                 Already have an account? <Text as="span" color="red.300" cursor="pointer" onClick={handleNavigate}>Login</Text>
                </Text>
              </Flex>
            </Box>
    )
}

export default Register;