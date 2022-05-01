import { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { 
  Image, Text, Button, Paper, Center, Anchor, 
  TextInput, Alert, Modal
} from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { usePaystackPayment } from 'react-paystack';
import { At, AlertCircle } from 'tabler-icons-react';
import useSWR from "swr";

//Paystack Secret Key
const secretKey = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;

const fetcher = (url) => fetch(url, {
  headers: {
    Authorization: 'Bearer ' + secretKey,
  }
}).then((res) => res.json());

export default function Home() {
  const [email, setEmail] = useState('');
  const [modal, setModal] = useState(true);

  const { data, error } = useSWR("https://api.paystack.co/transaction/totals", fetcher, {refreshInterval: 200});

  const notifications = useNotifications();

  /** All values or money are converted to pesewas because paystack uses pesewas as valid amount
   * Therefore, to get 20 cedis in pesewas, multiply 20 cedis by 100 pesewas, same for penalty amount.
   * 5 cedis in pesewas is 5 cedis times 100 pesewas
  */
  const amount = 2000;
  // penalty of 5 cedis for late payment. i.e if members don't pay before the month ends
  const penalty = 500;
  /** to get paystack charges, we need to find 1.95% of 20 cedis. 
  * i.e Paystack charges 1.95% for every transaction*/
  const paystack_charges = (amount / 100) * 1.95

  const config = {
    reference: (new Date()).getTime().toString(),
    email,
    amount: amount + paystack_charges + penalty,
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
        <Alert 
          icon={<AlertCircle size={16} />} 
          title="Penalty Reminder!" 
          color="red"
          mb={10}
        >
          Penalty of GHS 5.00 has been added to the monthly dues of GHS 20.00 because
          some members defaulted Last Month (April, 2022).
        </Alert>

        <Modal
          opened={modal}
          onClose={() => setModal(false)}
          title="Announcement!!!"
        >
          <Alert icon={<AlertCircle size={16} />} 
            title="Note!!!" 
            radius="md"
            variant="outline"
          >
            39 pesewas has been added to the 20 cedis. This is because paystack charges 
            1.95 % for every transaction they processed for us. Therefore you&apos;re required 
            to pay GHS 20.39 as your dues now. Thank you. 
            Contact Big Joe for further explanation if you don&apos;t understand anything.
          </Alert>

          <Text mt={10}>
            Visit {''}
              <a 
                href="https://paystack.com/gh/pricing?q=/pricing" 
                target='_blank'
                rel='noreferrer'
                title='Paystack Pricing'
              >
               Paystack Pricing
              </a> {''}
            to Read More on their charges.
          </Text>
        </Modal>

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
