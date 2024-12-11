import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row min-w-full">
      <div className="w-1/2 flex flex-col">
        <div className="relative m-5 md:mx-20 grow shrink">
          <Image
            className="rounded-2xl object-contain"
            src="/profile-pic.jpg"
            alt="Next.js Logo"
            fill={true}
            priority
          />
        </div>
        <div className="relative my-10 mx-10">
        Welcome! My name is Lukas Steinbrecher and this is my personal blog where I write about techie stuff. I'm based in Vienna 🇦🇹.

        I am a passionate Software Engineer 👨🏼‍💻, currently consulting financial institutions at Senacor.

        If you just want to say hello or ask a question, send me a short message 💌. I am always eager to make new connections.

</div></div>

      <div className="w-1/2">
        <h2>Posts</h2>
      </div>
    </main>
  )
}
