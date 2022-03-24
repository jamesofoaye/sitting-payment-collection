import Head from 'next/head'
import Link from 'next/link'
import { Image, Text, Button, Paper, Center, Anchor   } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import useSWR from "swr";
import { usePaystackPayment } from 'react-paystack';

const fetcher = (url) => fetch(url, {
  headers: {
    Authorization: 'Bearer ' + 'sk_test_5e47fa27035175b371c7eb328d2b5baee353b4c4',
}}).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("https://api.paystack.co/balance", fetcher, {refreshInterval: 200});
   const notifications = useNotifications();

  const config = {
      reference: (new Date()).getTime().toString(),
      email: "user@example.com",
      amount: 2000,
      publicKey: 'pk_test_08f29c1c4ec04ff7cb435e8ba4e4f70b99bdda29',
      currency: 'GHS'
  };
  
  // you can call this function anything
  const onSuccess = (reference) => {
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
    })
  }

  const initializePayment = usePaystackPayment(config);

  return (
    <div>
      <Head>
        <title>Sitting Payment Collection Platform</title>
        <meta name="description" content="Payment Collection Platform for a club in my neighborhood at Achimota Acc" />
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
          Available Balance: GHS {!data ? 'Please Wait, Loading Available Balance...' : data.available_balance}
        </Text>

        <Text align="center" size="lg" weight={500} mt="md">
          Ledger Balance: GHS {!data ? 'Please Wait, Loading Ledger Balance...' : data.ledger_balance}
        </Text>

        <Button 
          variant="default" 
          fullWidth 
          mt="md"
          onClick={() => {
            initializePayment(onSuccess, onClose)
          }}
        >
          Initiate Payment
        </Button>
      </Paper>
             
      <Center 
        style={{ 
          width: 400, 
          position: 'fixed', 
          left: 0, 
          bottom: 0,
        }}
      >
        Developed By {''}
        <Link href={'https://ofori-james-ayerakwa.me'} passHref>
          <Anchor target="_blank" style={{marginLeft: 5}}>
            Ofori James Ayerakwa
          </Anchor>
        </Link>
      </Center>
    </div>
  )
}
