import Image from "next/image"
import { FaBolt, FaLock, FaChartBar } from "react-icons/fa"

export default function AboutPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Stock Management System
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Empowering businesses with cutting-edge inventory solutions.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <FaBolt className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Lightning Fast</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Our system processes inventory updates in real-time, ensuring you always have the latest data at
                      your fingertips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <FaLock className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Secure</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Bank-level encryption and security measures keep your valuable inventory data safe and protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <FaChartBar className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Insightful Analytics</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Gain valuable insights with our advanced analytics tools, helping you make data-driven decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Revolutionizing Inventory Management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We're on a mission to simplify and optimize inventory management for businesses of all sizes. Our
              innovative solutions are designed to save you time, reduce costs, and improve accuracy.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Team</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Meet the Experts Behind Stock MS
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <Image
                  className="w-full h-48 object-cover"
                  src="/one.jpg"
                  alt="Jane Doe"
                  width={400}
                  height={400}
                />
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Jane Doe</h3>
                  <p className="text-base text-gray-500">CEO & Founder</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <Image
                  className="w-full h-48 object-cover"
                  src="/two.jpg"
                  alt="John Smith"
                  width={400}
                  height={400}
                />
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">John Smith</h3>
                  <p className="text-base text-gray-500">CTO</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <Image
                  className="w-full h-48 object-cover"
                  src="/three.jpg"
                  alt="Emily Johnson"
                  width={400}
                  height={400}
                />
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Emily Johnson</h3>
                  <p className="text-base text-gray-500">Head of Customer Success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

