import './App.css'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from "@/components/ui/label"

function App() {

  return (
    <div className="App">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
        <div className='list flex flex-col w-full gap-2'>
          <h3 className='flex text-md text-gray-400 font-bold hover:text-red-500 transition-all hover:text-lg'>라벨</h3>
          <input type="text" className='flex px-2 py-2 border-2 border-gray-400 rounded-lg' />
        </div>
        <div className='list flex flex-col w-full gap-2'>
          <h3 className='flex text-md text-gray-400 font-bold'>라벨</h3>
          <input type="text" className='flex px-2 py-2 border-2 border-gray-400 rounded-lg' />
        </div>
        <div className='list flex flex-col w-full gap-2'>
          <h3 className='flex text-md text-gray-400 font-bold'>라벨</h3>
          <input type="text" className='flex px-2 py-2 border-2 border-gray-400 rounded-lg' />
        </div>
      </div>

      <Button>하이하이</Button>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>


      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" />
      </div>
    </div>
  )
}

export default App
