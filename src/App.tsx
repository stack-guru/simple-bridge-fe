import { useState } from 'react'
import { Button, Box, Heading, Card, HStack, Center, Icon, Input, Field } from "@chakra-ui/react"

function App() {
  return (
    <Box padding={4}>
      <Heading marginTop={8} size={"4xl"} textAlign={"center"}>Bridge Testing!</Heading>
      <Box textAlign={"center"}>

      </Box>
      <HStack align={"center"} width={"full"} justifyContent={"center"} gap={8} marginTop={16}>
        <Card.Root width={"520px"}>
          <Card.Header>
            <Card.Title mb="2">Get USDV on Solana</Card.Title>
          </Card.Header>
          <Card.Body>
            <Field.Root>
              <Field.Label>
                Solana Address <Field.RequiredIndicator />
              </Field.Label>
              <Input placeholder="Solana Address" />
              <Field.HelperText>Solana Address</Field.HelperText>
            </Field.Root>
          </Card.Body>
          <Card.Footer justifyContent={"center"}>
            <Button marginTop={4}>Get</Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root width={"520px"}>
          <Card.Header>
            <Card.Title mb="2">Redeem USDV on Solana</Card.Title>
          </Card.Header>
          <Card.Body>
            <Field.Root>
              <Field.Label>
                Polygon Address <Field.RequiredIndicator />
              </Field.Label>
              <Input placeholder="Polygon Address" />
              <Field.HelperText>Polygon Address</Field.HelperText>
            </Field.Root>
          </Card.Body>
          <Card.Footer justifyContent={"center"}>
            <Button marginTop={4}>Redeem</Button>
          </Card.Footer>
        </Card.Root>
      </HStack>
    </Box>
  )
}

export default App
