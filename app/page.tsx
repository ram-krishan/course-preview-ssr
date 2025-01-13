import Image from "next/image";
import styles from "./page.module.css";

import { gql } from "@apollo/client";
import createApolloClient from "../apollo_client";

export const getContries = (async () => {

  return [{name: 'india'}]
})

export default async function Home() {
  const countries = await getContries();

  return (
    <div className={styles.grid}>
      {countries.map((country) => (
        <div key={country.code} className={styles.card}>
          <h3>{country.name}</h3>
          <p>
            {country.code} - {country.emoji}
          </p>
        </div>
      ))}
  </div>
  );
}
