
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  Edit, 
  MapPin, 
  CreditCard
} from 'lucide-react';

const AccountPage = () => {
  // This is mock data - eventually this would be connected to Shopify
  const [user] = useState({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    isLoggedIn: true
  });

  const [orders] = useState([
    { id: 'ORD-12345', date: '2025-04-10', status: 'Delivered', total: 6299 },
    { id: 'ORD-12344', date: '2025-03-25', status: 'Processing', total: 3569 }
  ]);

  const [addresses] = useState([
    { 
      id: '1',
      type: 'Home',
      name: 'Jane Smith',
      street: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      isDefault: true
    }
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container-custom pt-28 pb-20">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-8">My Account</h1>
        
        {user.isLoggedIn ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={18} />
                <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package size={18} />
                <span className="hidden md:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="hidden md:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart size={18} />
                <span className="hidden md:inline">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={18} />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="flex items-center">
                      <Input value={user.name} readOnly className="bg-gray-50" />
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Edit size={16} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center">
                      <Input value={user.email} readOnly className="bg-gray-50" />
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Edit size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>

              <Button variant="destructive" className="flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </Button>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{order.total.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="link" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {orders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="addresses">
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Saved Addresses</h2>
                    <Button size="sm" variant="outline">Add New Address</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4 relative">
                        {address.isDefault && (
                          <span className="absolute top-4 right-4 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <p className="font-medium">{address.type}</p>
                        <p className="mt-2 text-gray-700">{address.name}</p>
                        <p className="text-gray-700">{address.street}</p>
                        <p className="text-gray-700">{address.city}, {address.state} {address.zip}</p>
                        
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Remove</Button>
                          {!address.isDefault && (
                            <Button variant="outline" size="sm">Set as Default</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {addresses.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No addresses saved</p>
                      <Button variant="outline" size="sm" className="mt-4">Add Address</Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="wishlist">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <a href="/wishlist" className="block text-center py-6">
                  <h3 className="text-lg font-medium mb-2">View Your Wishlist</h3>
                  <p className="text-gray-500">See all items you've saved for later</p>
                  <Button className="mt-4">Go to Wishlist</Button>
                </a>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive emails about orders and promotions</p>
                      </div>
                      <div>
                        {/* Using shadcn-ui Switch component would be better here */}
                        <input type="checkbox" id="email-notifications" className="toggle" defaultChecked />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Receive text messages about order status</p>
                      </div>
                      <div>
                        {/* Using shadcn-ui Switch component would be better here */}
                        <input type="checkbox" id="sms-notifications" className="toggle" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CreditCard size={16} />
                    Add Payment Method
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Delete Account</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" size="sm">Delete Account</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium mb-4">Please log in to view your account</h3>
            <p className="text-gray-600 mb-6">Sign in to view your profile, orders, and wishlist</p>
            <div className="space-x-4">
              <Button>Log In</Button>
              <Button variant="outline">Create Account</Button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AccountPage;
