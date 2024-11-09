import React, { useEffect, useState } from 'react';
import { Sidebar } from '../shared/Sidebar';
import { githubAPI } from '../../lib/github';
import { useAuthStore } from '../../store/auth';
import { useAuth0 } from "@auth0/auth0-react";
import { GitPullRequest, DollarSign, CheckCircle, Wallet, Home } from 'lucide-react';
import axios from 'axios';

export const ContributorDashboard = () => {
  const [bounties, setBounties] = useState([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [repos, setRepos] = useState([]);
  const [contributions, setContributions] = useState(0);
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(true);

  // Code written by arsh
  useEffect(() => {
    if (token) {
      githubAPI.setToken(token);
      loadContributorData();
    }
  }, [token]);

  // useEffect(() => {
  //   const fetchContributorData = async () => {
  //     try {
  //       // Get access token for GitHub API
  //       const token = await getAccessTokenSilently({
  //         audience: "https://api.github.com/",
  //         scope: "read:user repo"
  //       });

  //       console.log("Access token:", token);

  //       // Fetch repositories
  //       const response = await axios.get("https://api.github.com/user/repos", {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       console.log("Repositories:", response);

  //       // Set repositories and calculate total contributions
  //       setRepos(response.data);
  //       const totalContributions = response.data.reduce((acc, repo) => acc + (repo.contributions || 0), 0);
  //       setContributions(totalContributions);

  //       // Fetch bounties if any specific API is set up for them (using dummy data here as a placeholder)
  //       const bountyResponse = await axios.get("/api/bounties"); // Replace with your endpoint
  //       setBounties(bountyResponse.data);
        
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   if (isAuthenticated) {
  //     fetchContributorData();
  //   }
  // }, [getAccessTokenSilently, isAuthenticated]);

  // if (loading) return <p>Loading dashboard...</p>;

  const loadContributorData = async () => {
    try {
      const issues = await githubAPI.getBountyIssues();
      setBounties(issues);

      const repositories = await githubAPI.getUserRepositories();
      setRepos(repositories);

      const totalContributions = repositories.reduce((acc, repo) => acc + repo.contributions, 0);
      setContributions(totalContributions);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar type="contributor" />

      {/* Dashboard Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Contributor Dashboard</h1>
          <div className="flex space-x-4">
            <a href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              <Home className="w-6 h-6" />
              Home
            </a>
            <a href="/wallet-connection" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              <Wallet className="w-6 h-6" />
              Connect Wallet
            </a>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Available Bounties</p>
                <h2 className="text-3xl font-bold">{bounties.length}</h2>
              </div>
              <GitPullRequest className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Contributions</p>
                <h2 className="text-3xl font-bold">{contributions}</h2>
              </div>
              <CheckCircle className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Repositories</p>
                <h2 className="text-3xl font-bold">{repos.length}</h2>
              </div>
              <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Repositories Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Repositories</h2>
          </div>
          <div className="p-6 space-y-4">
            {repos.map((repo) => (
              <div key={repo.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{repo.name}</h3>
                  <p className="text-sm text-gray-500">{repo.full_name}</p>
                </div>
                <span className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                  Contributions: {repo.contributions}
                </span>
              </div>
            ))}
            {/* {repos.map((repo) => (
              <div key={repo.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{repo.name}</h3>
                  <p className="text-sm text-gray-500">{repo.full_name}</p>
                </div>
                <span className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                  Contributions: {repo.contributions || "N/A"}
                </span>
              </div>
            ))} */}
          </div>
        </div>

        {/* Maintainer Section */}
        <div className="mt-8 text-center">
          <p className="text-lg font-medium">Do you want to become a maintainer?</p>
          <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};
