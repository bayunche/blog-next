import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import { WelcomePage } from './WelcomePage'

describe('WelcomePage', () => {
  it('reveals welcome messages when typing completes', async () => {
    render(<WelcomePage typingInterval={0} revealDelay={0} />)

    expect(await screen.findByText('和你们这些少爷不同，我们光是活着就竭尽全力了。')).toBeVisible()
    expect(screen.getByRole('button', { name: /进入首页/ })).toBeEnabled()
  })
})
