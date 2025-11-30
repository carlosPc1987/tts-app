const BackgroundImage = () => {
  return (
    <>
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.5) saturate(1.3)',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40"></div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.3),transparent_50%)]"></div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.3),transparent_50%)]"></div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.2),transparent_70%)]"></div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/40 to-black/60"></div>
    </>
  )
}

export default BackgroundImage
