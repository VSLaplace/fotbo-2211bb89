import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import HomePage from '../features/home/HomePage.jsx'
import ProgramPage from '../features/program/ProgramPage.jsx'
import VenuePage from '../features/venue/VenuePage.jsx'
import CommitteePage from '../features/committee/CommitteePage.jsx'
import ContactsPage from '../features/contacts/ContactsPage.jsx'
import NotFoundPage from '../features/not-found/NotFoundPage.jsx'
import { blockRoutes } from './blocks.jsx'

// One <Route> per page, added inside the <Layout> route — Layout draws the
// header and footer, so a page renders only its own content.
// blockRoutes stays outside it: a block brings its own chrome.
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/venue" element={<VenuePage />} />
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {blockRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
