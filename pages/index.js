import { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { Image, Text, Button, Paper, Center, Anchor, TextInput } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import useSWR from "swr";
import { usePaystackPayment } from 'react-paystack';
import { At } from 'tabler-icons-react';

//Paystack Secret Key
const secretKey = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;

const fetcher = (url) => fetch(url, {
  headers: {
    Authorization: 'Bearer ' + secretKey,
}}).then((res) => res.json());

export default function Home() {
  const [email, setEmail] = useState('');

  const { data, error } = useSWR("https://api.paystack.co/transaction/totals", fetcher, {refreshInterval: 200});

  const notifications = useNotifications();

  const config = {
    reference: (new Date()).getTime().toString(),
    email,
    amount: 2000,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    currency: 'GHS'
  };
  
  // you can call this function anything
  const onSuccess = () => {
    notifications.showNotification({
      title: 'Success',
      message: 'Payment Succesful👍✔',
    })
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    notifications.showNotification({
      title: 'Error',
      message: 'You cancelled the payment 🤥😢',
      color: 'red'
    })
  }

  const initializePayment = usePaystackPayment(config);

  return (
    <div>
      <Head>
        <title>Sitting Payment Collection Platform</title>
        <meta name="description" content="Payment Collection Platform for a club in my neighborhood at Achimota Accra" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Paper
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        })}
      >
        <div style={{ width: 240, marginLeft: 'auto', marginRight: 'auto' }}>
          <Image
            radius="md"
            src="/savings.svg"
            alt="Savings Image"
          />
        </div>

        <Text align="center" size="lg" weight={500} mt="md">
          Total Balance: {!data ? 'Please Wait, Loading Available Balance...' : `GHS ${data.data.total_volume/ 100}`}
        </Text>

        <Text align="center" size="lg" weight={500} my="md">
          Pending Balance: {!data ? 'Please Wait, Loading Pending Balance...' : `GHS ${data.data.pending_transfers/ 100}`}
        </Text>

        <TextInput 
          label="Your email" 
          placeholder="Your email" 
          icon={<At size={14} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!email ? 'Please enter your email' : null}
        />

        <Button 
          variant="default" 
          fullWidth 
          mt="md"
          onClick={() => {
            initializePayment(onSuccess, onClose)
          }}
          disabled={!email}
        >
          Initiate Payment
        </Button>
      </Paper>
             
      <Center 
        style={{ 
          position: 'fixed', 
          left: 0, 
          bottom: 0,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Developed By {''}
        <Link href={'https://ofori-james-ayerakwa.me'} passHref>
          <Anchor target="_blank" style={{ marginLeft: 5}}>
            Ofori James Ayerakwa
          </Anchor>
        </Link>
      </Center>
    </div>
  )
}
