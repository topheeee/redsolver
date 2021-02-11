import Head from "next/head"
import { Grid, Header, Image, Container } from "semantic-ui-react"

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Red Solver</title>
        <link rel='icon' href='/favicon.ico' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://redsolver.gg' />
        <meta property='og:title' content='Red Solver' />
        <meta
          property='og:description'
          content='A Pokemon HG/SS speedrunning tool.'
        />
        <meta property='og:image' content='https://redsolver.gg/red.png' />
      </Head>

      <Grid
        textAlign='center'
        style={{ height: "100vh" }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Grid textAlign='center' verticalAlign='middle'>
            <Grid.Row
              style={{
                paddingTop: "2em",
                marginBottom: "0",
                paddingBottom: "0",
              }}
            >
              <Header textAlign='center'>
                <Image src='/Red-Solver.png' style={{ width: "800px" }} />
              </Header>
            </Grid.Row>
            <Grid.Row>
              <Container textAlign='left' className='framed'>
                {children}
              </Container>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column>
                <i className='nes-bulbasaur' />
              </Grid.Column>
              <Grid.Column>
                <i className='nes-charmander' />
              </Grid.Column>
              <Grid.Column>
                <i className='nes-squirtle' />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid>

      {/* <footer>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by <img src='/vercel.svg' alt='Vercel Logo' />
        </a>
      </footer> */}
    </>
  )
}
