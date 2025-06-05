import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Lock } from "lucide-react";
import SidebarNav from "@/components/SidebarNav";

const Points = () => {
  return (
    <div className="flex min-h-screen bg-[#0E1116]">
      <SidebarNav />

      <div className="flex-1 ml-[256px] p-8">
        <h1 className="text-3xl font-semibold text-white mb-8">Points</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connect Wallet Card */}
          <Card className="md:col-span-2 bg-[#171A21] border-gray-800 text-white">
            <CardContent className="flex items-center justify-center py-16">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 w-[200px] h-[50px] text-lg"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>

          {/* Daily Drop Box */}
          <Card className="bg-[#171A21] border-gray-800 text-white relative">
            <CardHeader>
              <CardTitle className="text-xl text-white">Daily Drop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">
                XP converts to points during the weekly distribution.
              </p>
              <div className="absolute top-4 right-4 bg-gray-800 text-xs px-2 py-0.5 rounded-full">
                LOCKED
              </div>
            </CardContent>
          </Card>

          {/* Points Table */}
          <Card className="md:col-span-2 bg-[#171A21] border-gray-800 text-white">
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Week</TableHead>
                    <TableHead className="text-gray-300">Points</TableHead>
                    <TableHead className="text-gray-300">
                      Referral Points
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Empty state - table will be populated when user connects */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Locked Feature Box */}
          <Card className="bg-[#171A21] border-gray-800 text-white relative">
            <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Lock className="h-16 w-16 text-gray-500 mb-4" />
              <p className="text-gray-400 mb-8">
                You must rank up to access this feature.
              </p>
              <div className="absolute bottom-4 w-full text-center">
                <span className="bg-gray-800 text-gray-400 text-xs px-4 py-1 rounded-full">
                  Locked
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Points;
