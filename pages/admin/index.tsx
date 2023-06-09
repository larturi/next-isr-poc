import { useState, useEffect } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { Country } from '../../types/country';
import CountryCard from '../../components/CountryCard';

interface Props {
   apiUrl: string;
}

const AdminPage: NextPage<Props> = ({ apiUrl = '' }) => {


   console.log(apiUrl);

   const router = useRouter();

   const [countries, setCountries] = useState<Country[]>([]);

   const [newCountry, setNewCountry] = useState<Country>({
      id: 0,
      name: '',
      population: 0,
      continent: '',
   });

   const handleNewCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewCountry({
         ...newCountry,
         [e.target.name]: e.target.value,
      });
   };

   const handleNewCountrySubmit = async (
      e: React.FormEvent<HTMLFormElement>
   ) => {
      e.preventDefault();
      try {
         await axios.post(`${apiUrl}/country`, newCountry);

         getCountries();
         setNewCountry({
            id: 0,
            name: '',
            population: 0,
            continent: '',
         });
      } catch (error) {
         console.error('Error creating country:', error);
      }
   };

   useEffect(() => {
      getCountries();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleDelete = async (id: number) => {
      try {
         await axios.delete(`${apiUrl}/country/${id}`);
         const newCountries = countries.filter((country) => country.id !== id);
         setCountries(newCountries);
      } catch (error) {
         console.error('Error deleting country:', error);
      }
   };

   const getCountries = async () => {
      try {
         const { data } = await axios.get<Country[]>(`${apiUrl}/country`);
         setCountries(data);
      } catch (error) {
         console.error('Error fetching countries:', error);
      }
   };

   const handleRunSeedDb = async () => {
      try {
         await axios.get(`${apiUrl}/seed`);
         router.reload();
      } catch (error) {
         console.error('Error running seed', error);
      }
   }

   return (
      <div className='container mx-auto px-4 md:pt-10'>
         <Head>
            <title>Next ISR PoC - Admin DB</title>
            <link rel='icon' href='/favicon.ico' />
         </Head>

         <div className='
            flex 
            flex-col
            md:flex-row 
            justify-between
         '>

            <div className='
               flex
               flex-row
               justify-between
            '>
               <div className='mt-7'>
                  <h1 className='text-3xl'>Admin DB</h1>
                  <h2 className='text-lg text-gray-400'>Next ISR PoC</h2>
               </div>

               <div className='md:mt-9'>
                  <button
                     type='button'
                     className='
                        bg-orange-500 
                        text-white 
                        py-0
                        px-4 
                        rounded
                        h-11
                        ml-16
                        mt-10
                        md:mt-0
                     '
                     onClick={handleRunSeedDb}
                  >
                     Regenerate DB
                  </button>
               </div>
            </div>

            <div>
               <h3 className='text-xl mt-4 md:mt-0'>Add new country:</h3>
               <form
                  onSubmit={handleNewCountrySubmit}
                  className='
                     mt-3 
                     flex 
                     flex-col
                     md:flex-row 
                     justify-left 
                     gap-5
                  '
               >
                  <div className='mb-1 md:mb-4'>
                     <input
                        type='text'
                        placeholder='Name'
                        id='name'
                        name='name'
                        value={newCountry.name}
                        onChange={handleNewCountryChange}
                        required
                        className='border rounded px-3 py-2 text-black w-full'
                     />
                  </div>

                  <div className='mb-1 md:mb-4'>
                     <input
                        type='number'
                        placeholder='Population'
                        id='population'
                        name='population'
                        value={newCountry.population}
                        onChange={handleNewCountryChange}
                        required
                        className='border rounded px-3 py-2 text-black w-full'
                     />
                  </div>

                  <div className='mb-1 md:mb-4'>
                     <input
                        type='text'
                        placeholder='Continent'
                        id='continent'
                        name='continent'
                        value={newCountry.continent}
                        onChange={handleNewCountryChange}
                        required
                        className='border rounded px-3 py-2 text-black w-full'
                     />
                  </div>

                  <button
                     type='submit'
                     className='bg-green-500 text-white py-0 px-4 rounded h-11'
                  >
                     Add Country
                  </button>
               </form>
            </div>
         </div>

         <div className='flex flex-row justify-start gap-10 mt-6 md:mt-10'>
            <div className='container mx-auto'>
               {countries.map((country) => (
                  <CountryCard
                     key={country.id}
                     country={country}
                     showDeleteButton
                     onDelete={handleDelete}
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
   return {
      props: {
         apiUrl: process.env.API_URL || 'http://localhost:3000',
      },
   };
};

export default AdminPage;
