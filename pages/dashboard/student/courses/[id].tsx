import { GetServerSideProps } from 'next/types'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as string
  return {
    props: { id },
  }
}

export { default } from '../../manager/courses/[id]'
