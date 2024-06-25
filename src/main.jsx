import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/Context.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { element } from 'prop-types'
import TranscriptVideos from './pages/TranscriptVideos.jsx'
import PractiseSpeech from './pages/PractiseSpeech.jsx'
import SearchPrompts from './pages/SearchPrompts.jsx'
import Error from './pages/Error.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App />, errorElement: <Error />},
  { path: '/transcript-videos', element: <TranscriptVideos />, errorElement: <Error />},
  { path: '/practise-speech', element: <PractiseSpeech />, errorElement: <Error />},
  { path: '/search-prompts', element: <SearchPrompts />, errorElement: <Error />}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </ContextProvider>,
)
