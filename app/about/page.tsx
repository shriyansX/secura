import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Secura - About",
  description: "Learn more about Secura Password Manager",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About Secura</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                At Secura, our mission is to provide a secure, easy-to-use solution for managing your passwords and sensitive information. 
                In today&apos;s digital world, having strong, unique passwords for each of your accounts is essential, but remembering them all is nearly impossible. 
                That&apos;s where Secura comes in - we help you store, organize, and access your passwords securely whenever you need them.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Security First</h2>
              <p className="text-muted-foreground">
                Security is our top priority. Secura uses advanced encryption to protect your data, ensuring that your sensitive information remains private. 
                Your data is encrypted before it&apos;s stored, meaning even we can&apos;t access your passwords. We follow industry best practices for security and 
                regularly update our systems to protect against new threats.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Secure password storage with strong encryption</li>
                <li>Credit card information management</li>
                <li>Password strength analysis</li>
                <li>Secure password generator</li>
                <li>Quick search functionality</li>
                <li>User-friendly interface with dark mode support</li>
                <li>Cross-platform accessibility</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
              <p className="text-muted-foreground">
                We respect your privacy and are committed to protecting it. We do not sell or share your data with third parties. 
                Your encrypted data is stored securely and can only be accessed with your authentication credentials. 
                For more details, please refer to our full privacy policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}