import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
// import { Card, CardContent, CardHeader, Typography } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar } from "@/components/ui/avatar";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { User as UserIcon, Mail, Phone, MapPin, CreditCard, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    address: "",
    preferences: {
      dietary_restrictions: "",
      preferred_cuisine: "",
      notification_settings: {
        order_updates: true,
        promotions: true
      }
    }
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setProfileData({
        full_name: userData.full_name || "",
        phone: userData.phone || "",
        address: userData.address || "",
        preferences: userData.preferences || {
          dietary_restrictions: "",
          preferred_cuisine: "",
          notification_settings: {
            order_updates: true,
            promotions: true
          }
        }
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleSave = async () => {
    try {
      await User.updateMyUserData(profileData);
      setUser({ ...user, ...profileData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      navigate(createPageUrl('Landing'));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="animate-pulse space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-24 foodie-gradient"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 -mt-8">
              <Avatar className="w-16 h-16 bg-white border-4 border-white shadow-lg">
                <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-orange-500" />
                </div>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className={isEditing ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-red-500 border-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <Typography className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-orange-500" />
                Personal Information
              </Typography>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FormControlLabel htmlFor="full_name">Full Name</FormControlLabel>
                <TextField
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <FormControlLabel htmlFor="phone">Phone Number</FormControlLabel>
                <TextField
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <FormControlLabel htmlFor="address">Default Address</FormControlLabel>
                <TextField
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter your default delivery address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Food Preferences */}
          <Card>
            <CardHeader>
              <Typography className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Food Preferences
              </Typography>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FormControlLabel htmlFor="dietary">Dietary Restrictions</FormControlLabel>
                <TextField
                  id="dietary"
                  value={profileData.preferences?.dietary_restrictions || ""}
                  onChange={(e) => setProfileData({
                    ...profileData, 
                    preferences: {
                      ...profileData.preferences,
                      dietary_restrictions: e.target.value
                    }
                  })}
                  disabled={!isEditing}
                  placeholder="e.g., Vegetarian, Gluten-free, etc."
                />
              </div>
              
              <div>
                <FormControlLabel htmlFor="cuisine">Preferred Cuisine</FormControlLabel>
                <TextField
                  id="cuisine"
                  value={profileData.preferences?.preferred_cuisine || ""}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    preferences: {
                      ...profileData.preferences,
                      preferred_cuisine: e.target.value
                    }
                  })}
                  disabled={!isEditing}
                  placeholder="e.g., Italian, Asian, Mexican, etc."
                />
              </div>
              
              <div className="space-y-2">
                <FormControlLabel>Notification Preferences</FormControlLabel>
                <div className="space-y-2">
                  <FormControlLabel className="flex items-center space-x-2">
                    <TextField
                      type="checkbox"
                      checked={profileData.preferences?.notification_settings?.order_updates || false}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          notification_settings: {
                            ...profileData.preferences?.notification_settings,
                            order_updates: e.target.checked
                          }
                        }
                      })}
                      disabled={!isEditing}
                      className="text-orange-500"
                    />
                    <span className="text-sm">Order status updates</span>
                  </FormControlLabel>
                  <FormControlLabel className="flex items-center space-x-2">
                    <TextField
                      type="checkbox"
                      checked={profileData.preferences?.notification_settings?.promotions || false}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          notification_settings: {
                            ...profileData.preferences?.notification_settings,
                            promotions: e.target.checked
                          }
                        }
                      })}
                      disabled={!isEditing}
                      className="text-orange-500"
                    />
                    <span className="text-sm">Promotional offers</span>
                  </FormControlLabel>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Stats */}
        <Card className="mt-8">
          <CardHeader>
            <Typography>Account Statistics</Typography>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">0</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">$0</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">0</div>
                <div className="text-sm text-gray-600">Favorite Items</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-500">0</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
