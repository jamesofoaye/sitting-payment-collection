import Head from 'next/head'
import { Image, Text, Button, Paper } from '@mantine/core';
import useSWR from "swr";

const fetcher = (url) => fetch(url, {headers: {Authorization: 'Bearer ' + process.env.FLUTTERWAVE_SECRET_KEY}}).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("https://api.flutterwave.com/v3/balances/GHS", fetcher, {refreshInterval: 200});

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

        <Button variant="default" fullWidth mt="md">
          Initiate Payment
        </Button>
      </Paper>
    </div>
  )
}
