
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, CircleDollarSign, TrendingUp, Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  // Sample data for tables and charts
  const recentTransactions = [
    { id: 1, asset: "NEAR", amount: "120.50", type: "Deposit", date: "2025-05-10", status: "Completed" },
    { id: 2, asset: "ETH", amount: "0.25", type: "Withdraw", date: "2025-05-09", status: "Completed" },
    { id: 3, asset: "USDT", amount: "500.00", type: "Deposit", date: "2025-05-08", status: "Pending" },
    { id: 4, asset: "BTC", amount: "0.01", type: "Withdraw", date: "2025-05-07", status: "Completed" },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CircleDollarSign className="h-8 w-8 text-ping-700 mr-2" />
              <div>
                <p className="text-2xl font-bold">$12,580.90</p>
                <p className="text-xs text-green-600">+5.25% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-ping-700 mr-2" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-gray-500">Active positions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Available Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-ping-700 mr-2" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-gray-500">Connected wallets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="portfolio" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white shadow-md">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 flex items-center justify-center">
                  <p className="text-gray-400">Portfolio Chart</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 flex items-center justify-center">
                  <p className="text-gray-400">Asset Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.asset}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {tx.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 flex items-center justify-center">
                  <p className="text-gray-400">Activity Chart</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 flex items-center justify-center">
                  <p className="text-gray-400">Performance Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Recent Activity Section */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${tx.type === 'Deposit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.type === 'Deposit' ? 
                      <TrendingUp className="h-5 w-5 text-green-600" /> : 
                      <TrendingUp className="h-5 w-5 text-red-600 transform rotate-180" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{tx.type} {tx.asset}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${tx.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'Deposit' ? '+' : '-'}{tx.amount} {tx.asset}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
